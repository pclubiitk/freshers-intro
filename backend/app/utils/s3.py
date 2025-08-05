import os
from typing import List
import boto3
from botocore.exceptions import ClientError

# Load environment variables (optional, if using dotenv)
from dotenv import load_dotenv
load_dotenv()

# AWS configuration from .env
AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")
AWS_REGION = os.getenv("AWS_REGION")
S3_BUCKET = os.getenv("AWS_S3_BUCKET")

# Initialize boto3 S3 client
s3_client = boto3.client(
    "s3",
    aws_access_key_id=AWS_ACCESS_KEY_ID,
    aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
    region_name=AWS_REGION,
)


def generate_presigned_post(key: str, type:str , expires_in: int = 3600):
    """
    Generate a presigned POST URL for direct upload to S3 from the frontend.
    :param key: S3 object key (e.g. "user-profiles/123/photo1.jpg")
    :param expires_in: Expiration time in seconds
    :return: Dict with 'url' and 'fields' for HTML form upload
    """
    try:
        response = s3_client.generate_presigned_post(
            Bucket=S3_BUCKET,
            Key=key,
            Fields={
                "Content-Type": type,
                "Content-Disposition": "inline"  # optional, forces view not download
            },
            Conditions=[
                ["content-length-range", 0, 10 * 1024 * 1024],
                ["starts-with", "$Content-Type", "image/"],
                {"Content-Disposition": "inline"}
            ],
            ExpiresIn=expires_in
        )

        return response
    except ClientError as e:
        raise Exception(f"Error generating presigned URL: {e}")


def delete_s3_object(key: str):
    """
    Delete an object from S3 given its object key.
    :param key: S3 object key (e.g. "user-profiles/123/photo1.jpg")
    """
    try:
        s3_client.delete_object(Bucket=S3_BUCKET, Key=key)
    except ClientError as e:
        print(f"[S3 Delete Error] Failed to delete {key}: {e}")


def upload_svg_to_s3(svg_content: str, key: str) -> str:
  
    try:
        s3_client.put_object(
            Bucket=S3_BUCKET,
            Key=key,
            Body=svg_content.encode('utf-8'),
            ContentType='image/svg+xml',
            ContentDisposition='inline'
        )
        
        # Return the public URL
        url = f"https://{S3_BUCKET}.s3.{AWS_REGION}.amazonaws.com/{key}"
        return url
        
    except ClientError as e:
        raise Exception(f"Error uploading SVG to S3: {e}")

def delete_multiple_objects(keys: List[str]):
    s3_client.delete_objects(Bucket=S3_BUCKET, Delete={"Objects": [{"Key": key} for key in keys]})