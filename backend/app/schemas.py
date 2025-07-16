from datetime import date
from pydantic import BaseModel, EmailStr, validator

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
    id: int
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
