"""
Security utilities: rate limiting, input sanitization, and validation.
"""
import time
import html
import re
from collections import defaultdict
from typing import Dict, Tuple, Optional
from fastapi import Request, HTTPException
from app.core.config import settings


class RateLimiter:
    """
    Simple in-memory rate limiter using sliding window.
    For production, consider using Redis-based rate limiting.
    """
    
    def __init__(self, requests_per_window: Optional[int] = None, window_seconds: Optional[int] = None):
        self.requests_per_window = requests_per_window or settings.RATE_LIMIT_REQUESTS
        self.window_seconds = window_seconds or settings.RATE_LIMIT_WINDOW
        self.requests: Dict[str, list] = defaultdict(list)
    
    def _get_client_id(self, request: Request) -> str:
        """Get client identifier from request (IP address)."""
        forwarded = request.headers.get("X-Forwarded-For")
        if forwarded:
            return forwarded.split(",")[0].strip()
        return request.client.host if request.client else "unknown"
    
    def _cleanup_old_requests(self, client_id: str, current_time: float):
        """Remove requests outside the current window."""
        cutoff = current_time - self.window_seconds
        self.requests[client_id] = [
            ts for ts in self.requests[client_id] if ts > cutoff
        ]
    
    def check_rate_limit(self, request: Request) -> Tuple[bool, int]:
        """
        Check if request is within rate limit.
        Returns (is_allowed, remaining_requests).
        """
        client_id = self._get_client_id(request)
        current_time = time.time()
        
        self._cleanup_old_requests(client_id, current_time)
        
        if len(self.requests[client_id]) >= self.requests_per_window:
            return False, 0
        
        self.requests[client_id].append(current_time)
        remaining = self.requests_per_window - len(self.requests[client_id])
        return True, remaining
    
    async def __call__(self, request: Request):
        """FastAPI dependency for rate limiting."""
        is_allowed, remaining = self.check_rate_limit(request)
        if not is_allowed:
            raise HTTPException(
                status_code=429,
                detail="Rate limit exceeded. Please try again later.",
                headers={"Retry-After": str(self.window_seconds)}
            )
        return remaining


# Global rate limiter instances
chat_rate_limiter = RateLimiter(requests_per_window=30, window_seconds=60)  # 30 requests per minute for chat
contact_rate_limiter = RateLimiter(requests_per_window=5, window_seconds=300)  # 5 contact submissions per 5 minutes


class InputSanitizer:
    """Sanitize and validate user input to prevent XSS and injection attacks."""
    
    # Patterns that might indicate malicious input
    SUSPICIOUS_PATTERNS = [
        r'<script[^>]*>.*?</script>',
        r'javascript:',
        r'on\w+\s*=',
        r'<iframe[^>]*>',
        r'<object[^>]*>',
        r'<embed[^>]*>',
    ]
    
    @staticmethod
    def sanitize_string(text: str, max_length: Optional[int] = None) -> str:
        """
        Sanitize a string by escaping HTML and enforcing length limits.
        """
        if not text:
            return ""
        
        # Apply length limit
        max_len = max_length or settings.MAX_MESSAGE_LENGTH
        if len(text) > max_len:
            text = text[:max_len]
        
        # Escape HTML entities
        text = html.escape(text)
        
        return text
    
    @staticmethod
    def validate_input(text: str) -> Tuple[bool, str]:
        """
        Validate input for suspicious patterns.
        Returns (is_valid, error_message).
        """
        if not text:
            return True, ""
        
        for pattern in InputSanitizer.SUSPICIOUS_PATTERNS:
            if re.search(pattern, text, re.IGNORECASE | re.DOTALL):
                return False, "Input contains potentially unsafe content"
        
        return True, ""
    
    @staticmethod
    def sanitize_query(query: str) -> str:
        """Sanitize a chat query."""
        # Validate first
        is_valid, error = InputSanitizer.validate_input(query)
        if not is_valid:
            raise ValueError(error)
        
        # Sanitize
        return InputSanitizer.sanitize_string(query, settings.MAX_QUERY_LENGTH)
    
    @staticmethod
    def sanitize_email(email: str) -> str:
        """Basic email sanitization."""
        return InputSanitizer.sanitize_string(email.strip().lower(), 254)
    
    @staticmethod
    def sanitize_name(name: str) -> str:
        """Sanitize a name field."""
        sanitized = InputSanitizer.sanitize_string(name, 100)
        # Remove any remaining special characters except basic punctuation
        sanitized = re.sub(r'[^\w\s\-\.\']', '', sanitized)
        return sanitized.strip()


# Global sanitizer instance
sanitizer = InputSanitizer()