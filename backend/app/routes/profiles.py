import os
import re
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, joinedload
from app.database import get_db
from app.auth import get_current_user
from app.models import ProfileReport, User, UserProfile, UserImage, UserGeneratedArt
from app.schemas import ProfileReportCreate, ProfileReportOut, UserProfileCreate, UserProfileWithUser
from app.utils.s3 import delete_s3_object, upload_svg_to_s3
from typing import List, Optional
from uuid import UUID
import httpx
import asyncio


router = APIRouter()

# ds pav integration 
DSPAV = os.getenv("ART_URL")

async def dsgen(bio: str, username: str, user_id: str, db: Session):
    
    try:
        payload = {
            "bio": bio.strip(),
            "roll_number": username.strip()
        }
        print(f" Sending : {payload}")
        
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                f"{DSPAV}/generate",
                json=payload,
                headers={"Content-Type": "application/json"}
            )
            
            if response.status_code == 200:
                result = response.json()
                if result.get("success") and result.get("svg_data"):
                    svg_content = result["svg_data"]
                    
                    # Save SVG to S3
                    from datetime import datetime
                    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
                    s3_key = f"art-generation/{username}/art_{timestamp}.svg"
                    
                    try:
                        s3_url = upload_svg_to_s3(svg_content, s3_key)
                        print(f" SVG saved to S3: {s3_url}")
                        print(f" S3 Key: {s3_key}")
                        print(f" SVG size: {len(svg_content)} characters")
                    
                        try:
                            # art_record = UserGeneratedArt(
                            #     user_id=user_id,
                            #     bio_used=bio,
                            #     s3_key=s3_key,
                            #     s3_url=s3_url
                            # )
                            profile = db.query(UserProfile).filter_by(user_id=user_id).first()
                            profile.background_image = s3_url
                            db.commit()
                            # db.add(art_record)
                            # db.commit()
                            print(f"Art metadata saved  {user_id}")
                        except Exception as db_error:
                            print(f"Databasee error: {str(db_error)}")
                            db.rollback()
                            
                        
                        return s3_url  
                    except Exception as s3_error:
                        print(f" {s3_error}")
                        return False
                        
                else:
                    print(f" Art generation failed for {username}: {result.get('message', 'Unknown error')}")
                    return False
            else:
                print(f" Art server error {response.status_code} for {username}")
                try:
                    error_response = response.json()
                    print(f" Error details: {error_response}")
                except:
                    error_text = response.text
                    print(f" Error response: {error_text}")
                return False
                
    except Exception as e:
        print(f"{username}: {str(e)}")
        return False

@router.post("/create-or-update-profile")
async def create_or_update_profile(
    profile_data: UserProfileCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    profile = db.query(UserProfile).filter_by(user_id=user.id).first()
    email = user.email

    # checking if bio was updated
    bio_updated = False
    old_bio = None
    if profile:
        old_bio = profile.bio
        bio_updated = old_bio != profile_data.bio
    else:
        bio_updated = bool(profile_data.bio and profile_data.bio.strip())

    # Exclude both image_keys and socials from data to handle them separately
    data = profile_data.dict(exclude={"image_keys", "socials"})
    social_links = profile_data.socials or {}

    if profile:
        for attr, value in data.items():
            setattr(profile, attr, value)
        profile.socials = social_links
    else:
        profile = UserProfile(user_id=user.id, socials=social_links, **data)
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
        for key in keys_to_delete:
            delete_s3_object(key)
            db.query(UserImage).filter_by(user_id=user.id, image_key=key).delete()

        # Keys to add (newly uploaded)
        keys_to_add = new_keys - existing_keys
        for key in keys_to_add:
            image_url = f"https://{os.getenv('AWS_S3_BUCKET')}.s3.{os.getenv('AWS_REGION')}.amazonaws.com/{key}"
            db.add(UserImage(user_id=user.id, image_key=key, image_url=image_url))

    db.commit()
    db.refresh(profile)

    
    if bio_updated and profile_data.bio and profile_data.bio.strip():
        username = email.split('@')[0]  
        print(f" Bio changed for {user.username} ({username})")
        
        try:
            result = await dsgen(profile_data.bio, username, user.id, db)
            if result: 
                if isinstance(result, str): 
                    #print(f"saved to S3 for {user.username}")
                    print(f" Art URL: {result}")
                else:
                    print(f" Art generated for {user.username}")
            else:
                print(f" Art generation failed for {user.username}")
        except Exception as e:
            print(f" Art generation error for {user.username}: {str(e)}")

    return {"message": "Profile saved successfully"}


@router.get("/get-user-art/{user_id}")
async def get_user_art(user_id: UUID, db: Session = Depends(get_db)):
    """Get the latest generated art for a user"""
    art = (
        db.query(UserGeneratedArt)
        .filter_by(user_id=user_id)
        .order_by(UserGeneratedArt.created_at.desc())
        .first()
    )
    
    if not art:
        return {"has_art": False, "s3_url": None}
    
    return {
        "has_art": True, 
        "s3_url": art.s3_url,
        "bio_used": art.bio_used,
        "created_at": art.created_at
    }


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
        # Return a default profile structure instead of 404
        return {
            "id": None,
            "bio": None,
            "branch": None,
            "batch": None,
            "hostel": None,
            "interests": [],
            "socials": {},
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "is_verified": user.is_verified,
                "images": [
                    {"id": img.id, "image_url": img.image_url}
                    for img in user.images
                ],
            }
        }

    return {
    "id": profile.id,
    "bio": profile.bio,
    "branch": profile.branch,
    "batch": profile.batch,
    "hostel": profile.hostel,
    "interests": profile.interests,
    "socials": profile.socials, 
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
