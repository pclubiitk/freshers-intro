from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.routes import user, profiles, s3  # 👉 Import all your routers
from app.database import engine
from app import models
import os
import sys

# Create DB tables with better error handling
try:
    models.Base.metadata.create_all(bind=engine)
    print("✅ Database tables created successfully")
except Exception as e:
    print(f"❌ Failed to create database tables: {e}")
    print("💡 Try running the database setup script: python setup_database.py")
    print("💡 Or check if PostgreSQL is running and the database exists")
    # Don't exit here, let the app start so developers can see the API docs
    pass

app = FastAPI(
    title="Freshers Intro API",
    description="API for the Freshers Introduction Platform",
    version="1.0.0"
)

# Add exception handler for better error responses with CORS
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"detail": f"Internal server error: {str(exc)}"},
        headers={
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": "true",
            "Access-Control-Allow-Methods": "*",
            "Access-Control-Allow-Headers": "*",
        }
    )

origins = ["*"]  # Allow all origins for local development
# Fallback to environment variable if needed
env_origins = os.getenv("CORS_ORIGINS", "")
if env_origins:
    origins = env_origins.split(",")

# Allow frontend to talk to backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Register all route modules
app.include_router(user.router, tags=["Auth"])
app.include_router(profiles.router, prefix="/profile", tags=["Profile"])
app.include_router(s3.router, prefix="/s3", tags=["S3 Uploads"])
