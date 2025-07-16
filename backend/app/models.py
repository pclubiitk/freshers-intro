from sqlalchemy import Column, DateTime, Integer, String, Boolean, func
from .database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_verified = Column(Boolean, default=  False)
    last_verification_sent = Column(DateTime(timezone=True), nullable=True, default=func.now())