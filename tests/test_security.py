"""
Tests for security utilities: rate limiting and input sanitization.
"""
import pytest
from unittest.mock import MagicMock
from app.core.security import RateLimiter, InputSanitizer, sanitizer


class TestRateLimiter:
    """Tests for the RateLimiter class."""
    
    def test_allows_requests_under_limit(self):
        """Rate limiter should allow requests under the limit."""
        limiter = RateLimiter(requests_per_window=5, window_seconds=60)
        mock_request = MagicMock()
        mock_request.headers.get.return_value = None
        mock_request.client.host = "127.0.0.1"
        
        # First 5 requests should be allowed
        for i in range(5):
            is_allowed, remaining = limiter.check_rate_limit(mock_request)
            assert is_allowed is True
            assert remaining == 5 - i - 1
    
    def test_blocks_requests_over_limit(self):
        """Rate limiter should block requests over the limit."""
        limiter = RateLimiter(requests_per_window=3, window_seconds=60)
        mock_request = MagicMock()
        mock_request.headers.get.return_value = None
        mock_request.client.host = "127.0.0.1"
        
        # Use up the limit
        for _ in range(3):
            limiter.check_rate_limit(mock_request)
        
        # Next request should be blocked
        is_allowed, remaining = limiter.check_rate_limit(mock_request)
        assert is_allowed is False
        assert remaining == 0
    
    def test_tracks_different_clients_separately(self):
        """Rate limiter should track different clients independently."""
        limiter = RateLimiter(requests_per_window=2, window_seconds=60)
        
        client1 = MagicMock()
        client1.headers.get.return_value = None
        client1.client.host = "192.168.1.1"
        
        client2 = MagicMock()
        client2.headers.get.return_value = None
        client2.client.host = "192.168.1.2"
        
        # Client 1 uses their limit
        for _ in range(2):
            limiter.check_rate_limit(client1)
        
        # Client 1 is blocked
        is_allowed1, _ = limiter.check_rate_limit(client1)
        assert is_allowed1 is False
        
        # Client 2 should still have their limit
        is_allowed2, remaining = limiter.check_rate_limit(client2)
        assert is_allowed2 is True
        assert remaining == 1
    
    def test_uses_x_forwarded_for_header(self):
        """Rate limiter should use X-Forwarded-For header when present."""
        limiter = RateLimiter(requests_per_window=2, window_seconds=60)
        
        mock_request = MagicMock()
        mock_request.headers.get.return_value = "10.0.0.1, 10.0.0.2"
        mock_request.client.host = "127.0.0.1"
        
        # Use up the limit
        for _ in range(2):
            limiter.check_rate_limit(mock_request)
        
        # Should be blocked based on X-Forwarded-For (10.0.0.1)
        is_allowed, _ = limiter.check_rate_limit(mock_request)
        assert is_allowed is False


class TestInputSanitizer:
    """Tests for the InputSanitizer class."""
    
    def test_sanitize_string_escapes_html(self):
        """Sanitizer should escape HTML entities."""
        result = sanitizer.sanitize_string("<script>alert('xss')</script>")
        assert "<script>" not in result
        assert "&lt;script&gt;" in result
    
    def test_sanitize_string_respects_max_length(self):
        """Sanitizer should truncate strings exceeding max length."""
        long_text = "a" * 1000
        result = sanitizer.sanitize_string(long_text, max_length=100)
        assert len(result) == 100
    
    def test_sanitize_string_handles_empty_input(self):
        """Sanitizer should handle empty strings."""
        assert sanitizer.sanitize_string("") == ""
    
    def test_validate_input_detects_script_tags(self):
        """Validator should detect script tags."""
        is_valid, error = sanitizer.validate_input("<script>alert('xss')</script>")
        assert is_valid is False
        assert "unsafe" in error.lower()
    
    def test_validate_input_detects_javascript_urls(self):
        """Validator should detect javascript: URLs."""
        is_valid, error = sanitizer.validate_input("javascript:alert('xss')")
        assert is_valid is False
    
    def test_validate_input_detects_event_handlers(self):
        """Validator should detect inline event handlers."""
        is_valid, error = sanitizer.validate_input('<img onerror="alert(1)">')
        assert is_valid is False
    
    def test_validate_input_allows_normal_text(self):
        """Validator should allow normal text."""
        is_valid, error = sanitizer.validate_input("Hello, I'm interested in the position!")
        assert is_valid is True
        assert error == ""
    
    def test_sanitize_name_removes_special_chars(self):
        """Name sanitizer should remove special characters."""
        result = sanitizer.sanitize_name("John<>Doe&")
        assert "<" not in result
        assert ">" not in result
        assert "&" not in result
    
    def test_sanitize_name_keeps_valid_chars(self):
        """Name sanitizer should keep valid name characters."""
        result = sanitizer.sanitize_name("John Smith-Jones")
        assert "Smith" in result
        assert "-" in result
    
    def test_sanitize_email_lowercases(self):
        """Email sanitizer should lowercase emails."""
        result = sanitizer.sanitize_email("John.Doe@Example.COM")
        assert result == "john.doe@example.com"
    
    def test_sanitize_query_raises_on_malicious_input(self):
        """Query sanitizer should raise ValueError on malicious input."""
        with pytest.raises(ValueError):
            sanitizer.sanitize_query("<script>alert('xss')</script>")
