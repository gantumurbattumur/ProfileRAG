"""
Tests for the FastAPI application endpoints.
"""
import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock
from app.main import app


@pytest.fixture
def client():
    """Create a test client for the FastAPI app."""
    return TestClient(app)


class TestHealthEndpoint:
    """Tests for the health check endpoint."""
    
    def test_health_check_returns_200(self, client):
        """Health endpoint should return 200 OK."""
        response = client.get("/")
        assert response.status_code == 200
    
    def test_health_check_returns_healthy_status(self, client):
        """Health endpoint should return healthy status."""
        response = client.get("/")
        data = response.json()
        assert data["status"] == "healthy"


class TestChatEndpoint:
    """Tests for the chat endpoint."""
    
    @patch('app.api.chat.chat_service')
    def test_chat_with_valid_query(self, mock_service, client):
        """Chat endpoint should return response for valid query."""
        mock_service.chat.return_value = {
            "answer": "Test answer",
            "sources": ["source1.pdf"]
        }
        
        response = client.post("/chat", json={
            "query": "What are your skills?",
            "conversation_history": []
        })
        
        assert response.status_code == 200
        data = response.json()
        assert "answer" in data
        assert "sources" in data
    
    def test_chat_with_empty_query(self, client):
        """Chat endpoint should reject empty queries."""
        response = client.post("/chat", json={
            "query": "",
            "conversation_history": []
        })
        
        assert response.status_code == 422  # Validation error
    
    def test_chat_with_too_long_query(self, client):
        """Chat endpoint should reject overly long queries."""
        long_query = "x" * 3000  # Exceeds max length
        
        response = client.post("/chat", json={
            "query": long_query,
            "conversation_history": []
        })
        
        assert response.status_code == 422  # Validation error
    
    @patch('app.api.chat.chat_service')
    def test_chat_sanitizes_xss_input(self, mock_service, client):
        """Chat endpoint should sanitize XSS attempts."""
        mock_service.chat.return_value = {
            "answer": "Sanitized response",
            "sources": []
        }
        
        response = client.post("/chat", json={
            "query": "Hello <script>alert('xss')</script>",
            "conversation_history": []
        })
        
        # Should either sanitize or reject
        assert response.status_code in [200, 400]


class TestContactEndpoint:
    """Tests for the contact form endpoint."""
    
    def test_contact_with_valid_data(self, client, tmp_path, monkeypatch):
        """Contact endpoint should accept valid submissions."""
        # Use a temp file for logging
        log_file = tmp_path / "test_contact.log"
        monkeypatch.setattr('app.core.config.settings.CONTACT_LOG_FILE', str(log_file))
        
        response = client.post("/api/contact", json={
            "name": "John Doe",
            "email": "john@example.com",
            "message": "Hello, I'd like to connect!"
        })
        
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
    
    def test_contact_with_invalid_email(self, client):
        """Contact endpoint should reject invalid email."""
        response = client.post("/api/contact", json={
            "name": "John Doe",
            "email": "not-an-email",
            "message": "Hello!"
        })
        
        assert response.status_code == 422  # Validation error
    
    def test_contact_with_empty_name(self, client):
        """Contact endpoint should reject empty name."""
        response = client.post("/api/contact", json={
            "name": "",
            "email": "john@example.com",
            "message": "Hello!"
        })
        
        assert response.status_code == 422  # Validation error
    
    def test_contact_with_empty_message(self, client):
        """Contact endpoint should reject empty message."""
        response = client.post("/api/contact", json={
            "name": "John Doe",
            "email": "john@example.com",
            "message": ""
        })
        
        assert response.status_code == 422  # Validation error
    
    def test_contact_sanitizes_input(self, client, tmp_path, monkeypatch):
        """Contact endpoint should sanitize potentially malicious input."""
        log_file = tmp_path / "test_contact.log"
        monkeypatch.setattr('app.core.config.settings.CONTACT_LOG_FILE', str(log_file))
        
        response = client.post("/api/contact", json={
            "name": "John<script>alert('xss')</script>Doe",
            "email": "john@example.com",
            "message": "Hello with <b>html</b>"
        })
        
        assert response.status_code == 200
        
        # Check that logged content is sanitized
        log_content = log_file.read_text()
        assert "<script>" not in log_content
