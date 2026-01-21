"""
Tests for the configuration module.
"""
import os
import pytest
from unittest.mock import patch


class TestSettings:
    """Tests for the Settings configuration class."""
    
    def test_default_values(self):
        """Settings should have sensible defaults."""
        # Import inside test to avoid caching issues
        from app.core.config import Settings
        
        settings = Settings()
        
        assert settings.APP_NAME == "ProfileRAG"
        assert settings.DEBUG is False
        assert settings.RATE_LIMIT_REQUESTS == 100
        assert settings.RATE_LIMIT_WINDOW == 60
        assert settings.MAX_QUERY_LENGTH == 2000
        assert settings.MAX_MESSAGE_LENGTH == 5000
    
    def test_cors_origins_parsing(self):
        """Settings should parse ALLOWED_ORIGINS into a list."""
        from app.core.config import Settings
        
        settings = Settings(ALLOWED_ORIGINS="http://example.com,http://test.com")
        
        origins = settings.cors_origins
        assert isinstance(origins, list)
        assert "http://example.com" in origins
        assert "http://test.com" in origins
    
    def test_cors_origins_handles_whitespace(self):
        """Settings should handle whitespace in ALLOWED_ORIGINS."""
        from app.core.config import Settings
        
        settings = Settings(ALLOWED_ORIGINS="http://example.com , http://test.com ")
        
        origins = settings.cors_origins
        assert "http://example.com" in origins
        assert "http://test.com" in origins
    
    @patch.dict(os.environ, {"APP_NAME": "TestApp", "DEBUG": "true"})
    def test_reads_from_environment(self):
        """Settings should read from environment variables."""
        # Need to create a fresh instance to read env vars
        from app.core.config import Settings
        
        settings = Settings()
        
        assert settings.APP_NAME == "TestApp"
        assert settings.DEBUG is True
    
    @patch.dict(os.environ, {"ALLOWED_ORIGINS": "https://production.com"})
    def test_production_cors_from_env(self):
        """Settings should use production CORS origins from env."""
        from app.core.config import Settings
        
        settings = Settings()
        
        assert "https://production.com" in settings.cors_origins
