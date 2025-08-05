# from datetime import date
# from pydantic import BaseModel, EmailStr, validator
# from typing import List, Optional, Dict

# class UserCreate(BaseModel):
#     username: str
#     email: EmailStr
#     password: str
#     @validator("email")
#     def validate_iitk_email(cls, v):
#         if not v.endswith("@iitk.ac.in"):
#             raise ValueError("Email must be a valid @iitk.ac.in address")
#         return v


# class UserLogin(BaseModel):
#     email: EmailStr
#     password: str

#     @validator("email")
#     def validate_iitk_email(cls, v):
#         if not v.endswith("@iitk.ac.in"):
#             raise ValueError("Email must be a valid @iitk.ac.in address")
#         return v

# class UserOut(BaseModel):
#     id: int
#     username: str
#     email: EmailStr
#     is_verified: bool

#     class Config:
#         orm_mode = True

# class Token(BaseModel):
#     access_token: str
#     token_type: str

# class TokenData(BaseModel):
#     username: str | None = None


# class UserProfileCreate(BaseModel):
#     bio: Optional[str]
#     branch: Optional[str]
#     batch: Optional[str]
#     hostel: Optional[str]
#     hobbies: Optional[List[str]]
#     interests: Optional[List[str]]
#     image_keys: Optional[List[str]] = []

# class UserImageOut(BaseModel):
#     id: int
#     image_url: str

#     class Config:
#         orm_mode = True

# class UserProfileOut(BaseModel):
#     id: int
#     bio: Optional[str]
#     branch: Optional[str]
#     batch: Optional[str]
#     hostel: Optional[str]
#     hobbies: Optional[List[str]]
#     interests: Optional[List[str]]
#     images: List[UserImageOut]

#     class Config:
#         orm_mode = True

# class UserOutWithImages(BaseModel):
#     id: int
#     username: str
#     email: EmailStr
#     is_verified: bool
#     images: List[UserImageOut]

#     class Config:
#         orm_mode = True

# class UserProfileWithUser(BaseModel):
#     id: int
#     bio: Optional[str]
#     branch: Optional[str]
#     batch: Optional[str]
#     hostel: Optional[str]
#     hobbies: Optional[List[str]]
#     interests: Optional[List[str]]
#     user: UserOutWithImages

#     class Config:
#         orm_mode = True




from datetime import date, datetime
from uuid import UUID
from pydantic import BaseModel, EmailStr, Field, validator
from typing import List, Optional, Dict


class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str

    @validator("email")
    def validate_iitk_email(cls, v):
        # Whitelist specific email addresses
        whitelisted_emails = ["ananyk24@iitk.ac.in"]
        
        if v in whitelisted_emails or v.endswith("@iitk.ac.in"):
            return v
        else:
            raise ValueError("Email must be a valid @iitk.ac.in address")
        return v

class UserLogin(BaseModel):
    email: EmailStr
    password: str

    @validator("email")
    def validate_iitk_email(cls, v):
        # Whitelist specific email addresses
        whitelisted_emails = ["ananyk24@iitk.ac.in"]
        
        if v in whitelisted_emails or v.endswith("@iitk.ac.in"):
            return v
        else:
            raise ValueError("Email must be a valid @iitk.ac.in address")
        return v

class UserOut(BaseModel):
    id: UUID
    username: str
    email: EmailStr
    is_verified: bool

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: str | None = None


class UserProfileCreate(BaseModel):
    bio: Optional[str]
    branch: Optional[str]
    hostel: Optional[str]
    interests: Optional[List[str]]
    image_keys: Optional[List[str]] = []
    socials: Optional[Dict[str, str]] = Field(default_factory=dict)

class UserImageOut(BaseModel):
    id: UUID
    image_url: str

    class Config:
        from_attributes = True

class UserProfileOut(BaseModel):
    id: UUID
    bio: Optional[str]
    branch: Optional[str]
    batch: Optional[str]
    hostel: Optional[str]
    interests: Optional[List[str]]
    images: List[UserImageOut]
    socials: Optional[Dict[str, str]] = Field(default_factory=dict)


    class Config:
        from_attributes = True

class UserOutWithImages(BaseModel):
    id: UUID
    username: str
    email: EmailStr
    is_verified: bool
    images: List[UserImageOut]

    class Config:
        from_attributes = True

class UserProfileWithUser(BaseModel):
    id: Optional[UUID]  # Made optional to handle cases where profile doesn't exist yet
    bio: Optional[str]
    branch: Optional[str]
    batch: Optional[str]
    hostel: Optional[str]
    interests: Optional[List[str]]
    user: UserOutWithImages
    socials: Optional[Dict[str, str]] = Field(default_factory=dict)

    class Config:
        from_attributes = True


class ProfileReportCreate(BaseModel):
    reported_profile_id: UUID
    reason: Optional[str] = None

class ProfileReportOut(BaseModel):
    id: UUID
    reporter_id: UUID
    reported_profile_id: UUID
    reason: Optional[str]
    reporter: UserOut
    reported_profile: UserProfileWithUser
    created_at: datetime

    class Config:
        from_attributes = True

class ForgotPasswordRequest(BaseModel):
    email: EmailStr
    token: str


class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str