from fastapi import APIRouter, HTTPException, Depends, Request
from pydantic import BaseModel, EmailStr, field_validator
from datetime import datetime
import resend
from app.core.security import contact_rate_limiter, sanitizer
from app.core.config import settings

router = APIRouter()

# Initialize Resend with API key
resend.api_key = settings.RESEND_API_KEY


class ContactRequest(BaseModel):
    name: str
    email: EmailStr
    message: str
    
    @field_validator('name')
    @classmethod
    def validate_name(cls, v):
        if not v or not v.strip():
            raise ValueError('Name cannot be empty')
        if len(v) > 100:
            raise ValueError('Name too long (max 100 characters)')
        return v.strip()
    
    @field_validator('message')
    @classmethod
    def validate_message(cls, v):
        if not v or not v.strip():
            raise ValueError('Message cannot be empty')
        if len(v) > 5000:
            raise ValueError('Message too long (max 5000 characters)')
        return v.strip()


async def send_email_notification(name: str, email: str, message: str) -> bool:
    """Send email notification via Resend."""
    if not settings.RESEND_API_KEY or not settings.NOTIFICATION_EMAIL:
        return False
    
    try:
        html_content = f"""
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #3b82f6; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">
                📬 New Portfolio Contact
            </h2>
            <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 0 0 10px 0;"><strong>From:</strong> {name}</p>
                <p style="margin: 0 0 10px 0;"><strong>Email:</strong> <a href="mailto:{email}">{email}</a></p>
                <p style="margin: 0;"><strong>Received:</strong> {datetime.now().strftime('%B %d, %Y at %I:%M %p')}</p>
            </div>
            <div style="background: #fff; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
                <h3 style="margin-top: 0; color: #334155;">Message:</h3>
                <p style="white-space: pre-wrap; color: #475569;">{message}</p>
            </div>
            <p style="color: #94a3b8; font-size: 12px; margin-top: 20px;">
                This message was sent via your ProfileRAG portfolio contact form.
            </p>
        </div>
        """
        
        resend.Emails.send({
            "from": "Portfolio Contact <onboarding@resend.dev>",
            "to": [settings.NOTIFICATION_EMAIL],
            "subject": f"🚀 New Portfolio Contact from {name}",
            "html": html_content,
            "reply_to": email
        })
        return True
    except Exception as e:
        print(f"Failed to send email notification: {e}")
        return False


@router.post("/contact")
async def send_contact(
    request: ContactRequest,
    http_request: Request,
    remaining: int = Depends(contact_rate_limiter)
):
    try:
        # Sanitize all inputs
        sanitized_name = sanitizer.sanitize_name(request.name)
        sanitized_email = sanitizer.sanitize_email(request.email)
        sanitized_message = sanitizer.sanitize_string(request.message, 5000)
        
        # Validate sanitized inputs
        if not sanitized_name or not sanitized_message:
            raise HTTPException(status_code=400, detail="Invalid input after sanitization")
        
        # Send email notification via Resend
        email_sent = await send_email_notification(
            sanitized_name, 
            sanitized_email, 
            sanitized_message
        )
        
        # Also log to file as backup
        log_file = settings.CONTACT_LOG_FILE
        with open(log_file, "a") as f:
            f.write(f"\n[{datetime.now().isoformat()}]\n")
            f.write(f"Name: {sanitized_name}\n")
            f.write(f"Email: {sanitized_email}\n")
            f.write(f"Message: {sanitized_message}\n")
            f.write(f"Email notification sent: {email_sent}\n")
            f.write("-" * 50 + "\n")
        
        return {
            "success": True,
            "message": "Message received successfully"
        }
    except HTTPException:
        raise
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing contact: {str(e)}")
