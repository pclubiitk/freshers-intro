import os
import re
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, joinedload, selectinload
from app.database import get_db
from app.auth import get_current_user
from app.models import ProfileReport, User, UserProfile, UserImage
from app.schemas import ProfileReportCreate, ProfileReportOut, UserProfileCreate, UserProfileWithUser
from app.utils.s3 import delete_multiple_objects, delete_s3_object
from typing import List, Optional
from uuid import UUID


router = APIRouter()

@router.post("/create-or-update-profile")
def create_or_update_profile(
    profile_data: UserProfileCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    profile = db.query(UserProfile).filter_by(user_id=user.id).first()
    email = user.email


    data = profile_data.dict(exclude={"image_keys"})
    social_links = profile_data.socials or {}


    if profile:
        for attr, value in data.items():
            setattr(profile, attr, value)
        profile.socials = social_links
    else:
        profile = UserProfile(user_id=user.id, **data, socials=social_links)
        db.add(profile)

 
    match = re.search(r"(\d{2})@iitk\.ac\.in$", email)
    if match:
        year = match.group(1)
        profile.batch = f"Y{year}"
    else:
        raise HTTPException(400, "Invalid IITK email format")

    if profile_data.image_keys:
        # Get current image keys from DB
        existing_images = db.query(UserImage).filter_by(user_id=user.id).all()
        existing_keys = set(img.image_key for img in existing_images)
        new_keys = set(profile_data.image_keys)

        # Keys to delete (removed by user)
        keys_to_delete = existing_keys - new_keys
        # for key in keys_to_delete:
        #     delete_s3_object(key)
        #     db.query(UserImage).filter_by(user_id=user.id, image_key=key).delete()

        if keys_to_delete:
            delete_multiple_objects(list(keys_to_delete))
            db.query(UserImage).filter(
                UserImage.user_id == user.id,
                UserImage.image_key.in_(list(keys_to_delete))
            ).delete(synchronize_session=False)


        # Keys to add (newly uploaded)
        keys_to_add = new_keys - existing_keys
        if keys_to_add:
            new_images = [
        UserImage(
            user_id=user.id,
            image_key=key,
            image_url=f"https://{os.getenv('AWS_S3_BUCKET')}.s3.{os.getenv('AWS_REGION')}.amazonaws.com/{key}"
        )
        for key in keys_to_add
    ]
            db.bulk_save_objects(new_images)

    db.commit()
    return {"message": "Profile saved successfully"}

@router.post("/get-all-profiles", response_model=List[UserProfileWithUser])
def get_profiles(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    """
    Paginated route for profile data
    """
    profiles = (
        db.query(UserProfile)
        .join(User, User.id == UserProfile.user_id)
        .options(
            selectinload(UserProfile.user),
            selectinload(UserProfile.user).selectinload(User.images)
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
        .options(
            joinedload(UserProfile.user),
            joinedload(UserProfile.user).joinedload(User.images)
        )
        .first()
    )

    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    return profile


from fastapi import Query

@router.get("/get-profile-by-id", response_model=UserProfileWithUser)
def get_profile_by_user_id(
    id: UUID = Query(..., description="UUID of the User"),
    db: Session = Depends(get_db)
):
    profile = (
        db.query(UserProfile)
        .filter_by(user_id=id)
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
