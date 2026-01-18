from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
import os
from datetime import datetime

router = APIRouter()


class ContactRequest(BaseModel):
    name: str
    email: EmailStr
    message: str


@router.post("/contact")
async def send_contact(request: ContactRequest):
    try:
        # TODO: Implement email sending using a service like:
        # - SendGrid
        # - AWS SES
        # - Resend
        # - Or save to database
        
        # For now, just log it
        with open("contact_messages.log", "a") as f:
            f.write(f"\n[{datetime.now()}]\n")
            f.write(f"Name: {request.name}\n")
            f.write(f"Email: {request.email}\n")
            f.write(f"Message: {request.message}\n")
            f.write("-" * 50 + "\n")
        
        return {
            "success": True,
            "message": "Message received successfully"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing contact: {str(e)}")
