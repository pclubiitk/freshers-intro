from fastapi import APIRouter, HTTPException, Depends
from app.utils.s3 import generate_presigned_post
from app.auth import get_current_user

router = APIRouter()

@router.get("/s3/presign")
def presign_upload(filename: str, user=Depends(get_current_user)):
    # create unique key for image
    key = f"user-profiles/{user.id}/{filename}"
    try:
        data = generate_presigned_post(key)
        return {"upload_url": data["url"], "fields": data["fields"], "key": key}
    except Exception as e:
        raise HTTPException(500, str(e))
