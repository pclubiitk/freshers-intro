import os
import re
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, joinedload
from app.database import get_db
from app.auth import get_current_user
from app.models import ProfileReport, User, UserProfile, UserImage
from app.schemas import ProfileReportCreate, ProfileReportOut, UserProfileCreate, UserProfileWithUser
from app.utils.s3 import delete_s3_object
from typing import List, Optional
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
    email = user.email

    # Update or create profile
    if profile:
        for attr, value in profile_data.dict(exclude={"image_keys"}).items():
            setattr(profile, attr, value)
    else:
        profile = UserProfile(user_id=user.id, **profile_data.dict(exclude={"image_keys"}))
        db.add(profile)
    match = re.search(r"(\d{2})@iitk\.ac\.in$", email)
    if match:
        year = match.group(1)
        profile.batch = f"Y{year}"
    else:
        raise HTTPException(400, "Invalid IITK email format")

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
def get_my_profile(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    profile = (
        db.query(UserProfile)
        .filter_by(user_id=user.id)
        .join(User, User.id == UserProfile.user_id)
        .options(
            joinedload(UserProfile.user),
            joinedload(UserProfile.user).joinedload(User.images)
        )
        .first()
    )

    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    return {
    "id": profile.id,
    "bio": profile.bio,
    "branch": profile.branch,
    "batch": profile.batch,
    "hostel": profile.hostel,
    "interests": profile.interests,
    "user": {
        "id": profile.user.id,
        "username": profile.user.username,
        "email": profile.user.email,
        "images": [
            {"id": img.id, "image_url": img.image_url}
            for img in profile.user.images
        ],
        "is_verified": profile.user.is_verified
    }
}


from fastapi import Query

@router.get("/get-profile-by-id", response_model=UserProfileWithUser)
def get_profile_by_user_id(
    id: UUID = Query(..., description="UUID of the User"),
    db: Session = Depends(get_db)
):
    profile = (
        db.query(UserProfile)
        .filter_by(user_id=id)
        .join(User, User.id == UserProfile.user_id)
        .options(
            joinedload(UserProfile.user),
            joinedload(UserProfile.user).joinedload(User.images)
        )
        .first()
    )

    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found for given user_id")

    return profile
@router.get("/get-club-members", response_model=List[UserProfileWithUser])
def get_club_members(
    role: Optional[str] = Query(None, regex="^(secretary|coordinator)$"),
    db: Session = Depends(get_db),
):
    query = (
        db.query(UserProfile)
        .join(User, User.id == UserProfile.user_id)
        .options(
            joinedload(UserProfile.user),
            joinedload(UserProfile.user).joinedload(User.images)
        )
    )

    if role:
        query = query.filter(User.club_role == role)

    profiles = query.order_by(User.username.asc()).all()
    return profiles

from sqlalchemy.exc import IntegrityError

@router.post("/report-profile", response_model=ProfileReportOut)
def report_profile(
    report_data: ProfileReportCreate,
    db: Session = Depends(get_db),
    user = Depends(get_current_user),
):
    reported_profile = db.query(UserProfile).filter_by(user_id=report_data.reported_profile_id).first()
    print(report_data.reported_profile_id)
    if not reported_profile:
        raise HTTPException(status_code=404, detail="Profile not found.")
    if reported_profile.user_id == user.id:
        raise HTTPException(status_code=401, detail="Why do you want to report yourself?")

    report = ProfileReport(
        reporter_id=user.id,
        reported_profile_id=report_data.reported_profile_id,
        reason=report_data.reason,
    )

    db.add(report)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="You have already reported this profile.")

    db.refresh(report)
    return report

@router.get("/get-reports", response_model=List[ProfileReportOut])
def get_reports(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.club_role not in ["secretary", "coordinator"]:
        raise HTTPException(
            status_code=403,
            detail="Forbidden."
        )

    return db.query(ProfileReport).all()


@router.delete("/delete-report/{report_id}")
def delete_report(report_id: UUID, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    if user.club_role not in ["secretary", "coordinator"]:
        raise HTTPException(status_code=403, detail="Access denied")

    report = db.query(ProfileReport).filter(ProfileReport.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")

    db.delete(report)
    db.commit()
    return {"detail": "Report deleted successfully"}

@router.post("/delete-profile/{profile_id}")
def delete_profile_and_report(profile_id: UUID, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    if user.club_role not in ["secretary", "coordinator"]:
        raise HTTPException(status_code=403, detail="Access denied")

    profile = db.query(UserProfile).filter(UserProfile.id == profile_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    db.query(ProfileReport).filter(ProfileReport.reported_profile_id == profile.user_id).delete(synchronize_session=False)

    db.delete(profile)
    db.commit()

    return {"detail": "Profile and associated reports deleted successfully"}
