import uuid
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy import Column, DateTime, String, Boolean, ForeignKey, JSON, func
from sqlalchemy.orm import relationship
from .database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    username = Column(String)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_verified = Column(Boolean, default=False)
    last_verification_sent = Column(DateTime(timezone=True), nullable=True, default=func.now())


class UserProfile(Base):
    __tablename__ = "user_profiles"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), unique=True, nullable=False)
    bio = Column(String, nullable=True)
    branch = Column(String, nullable=True)
    batch = Column(String, nullable=True)
    hostel = Column(String, nullable=True)
    hobbies = Column(JSON, nullable=True)        # List of hobbies
    interests = Column(JSON, nullable=True)      # List of interests

    user = relationship("User", backref="profile")


class UserImage(Base):
    __tablename__ = "user_images"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    image_key = Column(String, nullable=False)   # S3 object key
    image_url = Column(String, nullable=False)   # Full public URL

    user = relationship("User", backref="images")
