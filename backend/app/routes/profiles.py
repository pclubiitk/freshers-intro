import os
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.auth import get_current_user
from app.models import User, UserProfile, UserImage
from app.schemas import UserProfileCreate, UserProfileOut
from app.utils.s3 import delete_s3_object, generate_presigned_post

router = APIRouter()

@router.post("/create-or-update-profile", response_model=UserProfileOut)
def create_or_update_profile(
    profile_data: UserProfileCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    # Check if profile exists
    profile = db.query(UserProfile).filter_by(user_id=user.id).first()

    # Update or create profile
    if profile:
        for attr, value in profile_data.dict(exclude={"image_keys"}).items():
            setattr(profile, attr, value)
    else:
        profile = UserProfile(user_id=user.id, **profile_data.dict(exclude={"image_keys"}))
        db.add(profile)

    # Handle image replacement
    if profile_data.image_keys:  # New images are provided
        # Delete old images from S3 + DB
        old_images = db.query(UserImage).filter_by(user_id=user.id).all()
        for image in old_images:
            delete_s3_object(image.image_key)
            db.delete(image)

        # Add new images
        for key in profile_data.image_keys:
            image_url = f"https://{os.getenv('AWS_S3_BUCKET')}.s3.amazonaws.com/{key}"
            db.add(UserImage(user_id=user.id, image_key=key, image_url=image_url))

    db.commit()
    db.refresh(profile)
    return profile

