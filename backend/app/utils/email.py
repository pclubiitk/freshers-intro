import os
import aiosmtplib
from email.message import EmailMessage
from email.utils import formataddr

SMTP_HOST = os.getenv("SMTP_HOST")
SMTP_PORT = int(os.getenv("SMTP_PORT", 587))
SMTP_USER = os.getenv("SMTP_USER")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")
FROM_EMAIL = os.getenv("FROM_EMAIL", SMTP_USER)
FRONTEND_URL = os.getenv("FRONTEND_URL")

async def send_verification_email(to_email: str, token: str):
    verify_url = f"{FRONTEND_URL}/verify-email?token={token}"

    message = EmailMessage()
    message["From"] = formataddr(("Freshers PClub", FROM_EMAIL))
    message["To"] = to_email
    message["Subject"] = "Verify your IITK Email"

    # Plaintext fallback
    message.set_content(
        f"Click the link to verify your email: {verify_url}"
    )

    # HTML version with clickable link
    message.add_alternative(
        f"""\
        <html>
            <body>
                <p>Click the button below to verify your email:</p>
                <p><a href="{verify_url}" style="background-color:#4CAF50;color:white;
                padding:10px 20px;text-decoration:none;border-radius:5px;">Verify Email</a></p>
                <p>Or open this link in your browser: <a href="{verify_url}">{verify_url}</a></p>
            </body>
        </html>
        """,
        subtype="html"
    )

    await aiosmtplib.send(
        message,
        hostname=SMTP_HOST,
        port=SMTP_PORT,
        start_tls=True,
        username=SMTP_USER,
        password=SMTP_PASSWORD,
    )

async def send_reset_email(to_email: str, reset_token: str):
    reset_url = f"{FRONTEND_URL}/reset-password?token={reset_token}"

    message = EmailMessage()
    message["From"] = formataddr(("Freshers PClub", FROM_EMAIL))
    message["To"] = to_email
    message["Subject"] = "Reset Your Password"

    message.set_content(
        f"You requested a password reset. Click this link to reset your password: {reset_url}\n\n"
        "This link will expire in 15 minutes."
        "If you didn't request this, you can safely ignore this email."
    )

    message.add_alternative(
        f"""\
        <html>
            <body>
                <p>We received a request to reset your password. This link will expire in 15 minutes.</p>
                <p><a href="{reset_url}" style="background-color:#007BFF;color:white;
                padding:10px 20px;text-decoration:none;border-radius:5px;">Reset Password</a></p>
                <p>If you didn't request this, you can safely ignore this email.</p>
                <p>Or manually open this link: <a href="{reset_url}">{reset_url}</a></p>
            </body>
        </html>
        """,
        subtype="html"
    )

    await aiosmtplib.send(
        message,
        hostname=SMTP_HOST,
        port=SMTP_PORT,
        start_tls=True,
        username=SMTP_USER,
        password=SMTP_PASSWORD,
    )