from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import chat, health, contact
from app.core.config import settings

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="A RAG-powered portfolio chatbot API"
)

# CORS Configuration - uses environment variable ALLOWED_ORIGINS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"],
)

app.include_router(chat.router)
app.include_router(health.router)
app.include_router(contact.router, prefix="/api")