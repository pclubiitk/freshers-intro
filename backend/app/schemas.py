from datetime import date
from uuid import UUID
from pydantic import BaseModel, EmailStr, validator
from typing import List, Optional, Dict

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str
    @validator("email")
    def validate_iitk_email(cls, v):
        if not v.endswith("@iitk.ac.in"):
            raise ValueError("Email must be a valid @iitk.ac.in address")
        return v


class UserLogin(BaseModel):
    email: EmailStr
    password: str

    @validator("email")
    def validate_iitk_email(cls, v):
        if not v.endswith("@iitk.ac.in"):
            raise ValueError("Email must be a valid @iitk.ac.in address")
        return v

class UserOut(BaseModel):
    id: UUID
    username: str
    email: EmailStr
    is_verified: bool

    class Config:
        orm_mode = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: str | None = None


class UserProfileCreate(BaseModel):
    bio: Optional[str]
    branch: Optional[str]
    batch: Optional[str]
    hostel: Optional[str]
    hobbies: Optional[List[str]]
    interests: Optional[List[str]]
    image_keys: Optional[List[str]] = []

class UserImageOut(BaseModel):
    id: UUID
    image_url: str

    class Config:
        orm_mode = True

class UserProfileOut(BaseModel):
    id: UUID
    bio: Optional[str]
    branch: Optional[str]
    batch: Optional[str]
    hostel: Optional[str]
    hobbies: Optional[List[str]]
    interests: Optional[List[str]]
    images: List[UserImageOut]

    class Config:
        orm_mode = True

class UserOutWithImages(BaseModel):
    id: UUID
    username: str
    email: EmailStr
    is_verified: bool
    images: List[UserImageOut]

    class Config:
        orm_mode = True

class UserProfileWithUser(BaseModel):
    id: UUID
    bio: Optional[str]
    branch: Optional[str]
    batch: Optional[str]
    hostel: Optional[str]
    hobbies: Optional[List[str]]
    interests: Optional[List[str]]
    user: UserOutWithImages

    class Config:
        orm_mode = True
