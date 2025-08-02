from fastapi import APIRouter, HTTPException, Depends
from app.utils.s3 import generate_presigned_post
from app.auth import get_current_user
import uuid

router = APIRouter()

@router.get("/presign")
def presign_upload(filename: str, type:str, user=Depends(get_current_user)):
    # create unique key for image
    key = f"user-profiles/{user.id}/{filename}---{uuid.uuid4()}"
    try:
        data = generate_presigned_post(key,type=type)
        return {"upload_url": data["url"], "fields": data["fields"], "key": key}
    except Exception as e:
        raise HTTPException(500, str(e))
    
