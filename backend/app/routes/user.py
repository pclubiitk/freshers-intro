import secrets
from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, status, Request
from fastapi.responses import Response
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session
from app import models, schemas, auth
from app.models import PasswordResetToken, User
from app.database import get_db
from app.utils.email import send_reset_email, send_verification_email
from jose import JWTError, jwt
from datetime import datetime, timedelta, timezone
import os
import pytz, httpx
from app.auth import pwd_context
ist = pytz.timezone('Asia/Kolkata')
router = APIRouter(prefix="/auth", tags=["Auth"])
RESEND_COOLDOWN = os.getenv("RESEND_COOLDOWN")
FRONTEND_DOMAIN = os.getenv("FRONTEND_DOMAIN")
RECAPTCHA_SECRET = os.getenv("RECAPTCHA_SECRET")
ENV = os.getenv("ENV")
@router.post("/signup")
async def signup(user: schemas.UserCreate, db: Session = Depends(get_db)):
    email = user.email.lower()
    existing = db.query(models.User).filter(models.User.email == str.lower(user.email)).first()
    if existing:
        if existing.is_verified:
            raise HTTPException(status_code=400, detail="User already registered")
        else:
            existing.username = user.username
            existing.hashed_password = auth.get_password_hash(user.password)
            existing.last_verification_sent = datetime.now(ist)
            target_user = existing
    else:
        # Commented out Y25 restriction for testing
        # prefix = email.split('@')[0]
        # if ENV != "staging" and not prefix.endswith('25'):
        #     raise HTTPException(status_code=403, detail="Only Y25s are allowed to register.")
        
        target_user = models.User(
            username=user.username,
            email=email,
            hashed_password=auth.get_password_hash(user.password),
            last_verification_sent=datetime.now(ist)
        )
        db.add(target_user)
    db.commit()
    db.refresh(target_user)

    # Generate email verification token
    verification_token = auth.create_access_token(
        data={"sub": user.email},
        expires_delta=timedelta(hours=1)
    )

    try:
        await send_verification_email(user.email, verification_token)
        target_user.last_verification_sent = datetime.now(ist)

        db.commit()
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to send verification mail. Login to try again.")

    return {"message": "Signup was successful."}

@router.get("/verify-email")
def verify_email(token: str, db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(token, auth.SECRET_KEY, algorithms=[auth.ALGORITHM])
        email = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=400, detail="Invalid token")
    except JWTError:
        raise HTTPException(status_code=400, detail="Invalid or expired token")

    user = db.query(models.User).filter(models.User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if user.is_verified:
        return {"message": "Email already verified"}

    user.is_verified = True
    db.commit()
    return {"message": "Email verified successfully"}


@router.post("/login")
def login(form: schemas.UserLogin, response: Response, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == form.email.lower()).first()
    if not user or not auth.verify_password(form.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    if not user.is_verified:
        raise HTTPException(status_code=403, detail="Email not verified")

    token = auth.create_access_token(data={"sub": user.email})
    # Set cookie with JWT token
    # response.set_cookie(
    #     key="access_token",
    #     value=token,
    #     httponly=True,
    #     secure=True,             # Set True in production (HTTPS)
    #     samesite="none",         # Required for cross-site cookies
    #     domain=FRONTEND_DOMAIN,
    #     path="/",
    #     max_age=60 * 60 * 24     # 1 day
    # )

    response.headers.append(
        "Set-Cookie",
        f"access_token={token}; Path=/; Secure; Partitioned; SameSite=None; Max-Age=86400"
    )

    return {"message": "Login successful"}


class ResendRequest(BaseModel):
    email: EmailStr
    password: str

@router.post("/resend-verification")
async def resend_mail (payload: ResendRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email.lower()).first()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")

    if not auth.verify_password(payload.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials.")

    if user.is_verified:
        raise HTTPException(status_code=400, detail="Email already verified.")


    last_sent = user.last_verification_sent
    if last_sent.tzinfo is None:
        last_sent = last_sent.replace(tzinfo=timezone.utc)
    now = datetime.now(timezone.utc)
    COOLDOWN = timedelta(minutes=int(RESEND_COOLDOWN))
    elapsed = now - last_sent
    remaining = COOLDOWN - elapsed
    if remaining.total_seconds() > 0:
        minutes_left = int(remaining.total_seconds() // 60) + 1
        raise HTTPException(status_code=429, detail=f"Wait {minutes_left} minute(s) before requesting another mail.")
    

    token = auth.create_access_token(
        data={"sub": user.email},
        expires_delta=timedelta(minutes=10)
    )
    try:
        await send_verification_email(user.email, token)
        user.last_verification_sent = datetime.now(ist)
        db.commit()
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to send email. Try again later.")

    return {"detail": "Verification email resent successfully."}


@router.get("/me")
def get_me(
    request: Request,
    db: Session = Depends(get_db)
):
    user = auth.get_current_user(request, db)
    return {
        "email": user.email,
        "username": user.username,
        "is_verified": user.is_verified,
        "club_role": user.club_role
    }

@router.post("/logout")
def logout(response: Response):
    # response.delete_cookie("access_token")

    response.headers.append(
        "Set-Cookie",
        f"access_token=; Path=/; Secure; Partitioned; SameSite=None; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT"
    )


    return {"message": "Logged out"}


# forgot pass route

@router.post("/forgot-password")
async def forgot_password (req: schemas.ForgotPasswordRequest, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    async with httpx.AsyncClient() as client:
        res = await client.post("https://www.google.com/recaptcha/api/siteverify", data={
            'secret': RECAPTCHA_SECRET,
            'response': req.token
        })
        result = res.json()
        print(result)
        if not result.get("success"):
            raise HTTPException(status_code=400, detail="Failed reCAPTCHA validation")

    
    user = db.query(User).filter(User.email == req.email.lower()).first()
    if not user:
        return {"message": "If an account exists, a reset link has been sent."}

    reset_token = secrets.token_urlsafe(32)
    expires_at = datetime.now() + timedelta(minutes=15)

    tokendata = PasswordResetToken(user_id = user.id, token = reset_token, expires_at = expires_at)
    db.add(tokendata)
    background_tasks.add_task(send_reset_email, user.email, reset_token)
    db.commit()
    return {"message": "Password reset link sent successfully."}

@router.post('/reset-password')
async def reset_password (data: schemas.ResetPasswordRequest, db: Session = Depends(get_db)):
    tokendata = db.query(PasswordResetToken).filter(PasswordResetToken.token == data.token).first()
    if not tokendata:
        raise HTTPException(status_code=400, detail="Invalid or expired token")
    
    if tokendata.expires_at < datetime.now(timezone.utc):
        raise HTTPException(status_code=400, detail="Invalid or expired token")

    if tokendata.used:
        raise HTTPException(status_code=400, detail="Token has already been used")
    
    user = db.query(User).filter(User.id == tokendata.user_id).first()

    if not user:
            raise HTTPException(status_code=404, detail="User not found")
    hashed_password = pwd_context.hash(data.new_password)
    user.hashed_password = hashed_password
    tokendata.used = True
    db.commit()
    return {"message": "Password reset successful"}