import os
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from app.database import get_db
from app.auth import get_current_user
from app.models import User, UserProfile, UserImage
from app.schemas import UserProfileCreate, UserProfileWithUser
from app.utils.s3 import delete_s3_object
from typing import List
from uuid import UUID


router = APIRouter()

@router.post("/create-or-update-profile")
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
            image_url = f"https://{os.getenv('AWS_S3_BUCKET')}.s3.{os.getenv('AWS_REGION')}.amazonaws.com/{key}"
            db.add(UserImage(user_id=user.id, image_key=key, image_url=image_url))

    db.commit()
    db.refresh(profile)
    return {"message":"Profile saved successfully"}

@router.post("/get-all-profiles", response_model=List[UserProfileWithUser])
def get_profiles(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    """
    Paginated route for profile data
    """
    profiles = (
        db.query(UserProfile)
        .join(User, User.id == UserProfile.user_id)
        .options(
            joinedload(UserProfile.user),
            joinedload(UserProfile.user).joinedload(User.images)
        )
        .order_by(User.username.asc())
        .offset(skip)
        .limit(limit)
        .all()
    )
    return profiles


@router.get("/get-my-profile", response_model=UserProfileWithUser)
def get_my_profile(db: Session = Depends(get_db), user: User = Depends(get_current_user),):
    profiles = (
        db.query(UserProfile)
        .filter_by(user_id=user.id)
        .join(User, User.id == UserProfile.user_id)
        .options(
            joinedload(UserProfile.user),
            joinedload(UserProfile.user).joinedload(User.images)
        )
        .first()
    )
    return profiles