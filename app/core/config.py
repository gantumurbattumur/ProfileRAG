"""
Application configuration using environment variables.
"""
import os
from functools import lru_cache
from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    
    # API Configuration
    APP_NAME: str = "ProfileRAG"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False
    
    # OpenAI Configuration
    OPENAI_API_KEY: str = ""
    MODEL_NAME: str = "gpt-3.5-turbo"
    EMBEDDING_MODEL_NAME: str = "sentence-transformers/all-MiniLM-L6-v2"
    
    # CORS Configuration - comma-separated list of allowed origins
    ALLOWED_ORIGINS: str = "http://localhost:5173,http://localhost:5174,http://127.0.0.1:5173,http://127.0.0.1:5174"
    
    # Rate Limiting
    RATE_LIMIT_REQUESTS: int = 100  # requests per window
    RATE_LIMIT_WINDOW: int = 60  # window in seconds
    
    # Contact Form
    CONTACT_LOG_FILE: str = "contact_messages.log"
    
    # Email Notifications (Resend)
    RESEND_API_KEY: str = ""
    NOTIFICATION_EMAIL: str = ""
    
    # Security
    MAX_QUERY_LENGTH: int = 2000
    MAX_MESSAGE_LENGTH: int = 5000
    
    @property
    def cors_origins(self) -> List[str]:
        """Parse ALLOWED_ORIGINS into a list."""
        return [origin.strip() for origin in self.ALLOWED_ORIGINS.split(",") if origin.strip()]
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        extra = "ignore"


@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()


settings = get_settings()