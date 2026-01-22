# chat endpoints
from fastapi import APIRouter, HTTPException, Depends, Request
from pydantic import BaseModel, field_validator
from app.rag.chat_services import ChatService
from app.core.security import chat_rate_limiter, sanitizer
from app.core.config import settings

router = APIRouter()
chat_service = ChatService()


class ChatRequest(BaseModel):
    query: str
    conversation_history: list[dict] = []
    
    @field_validator('query')
    @classmethod
    def validate_query(cls, v):
        if not v or not v.strip():
            raise ValueError('Query cannot be empty')
        if len(v) > settings.MAX_QUERY_LENGTH:
            raise ValueError(f'Query too long (max {settings.MAX_QUERY_LENGTH} characters)')
        return v.strip()


class ChatResponse(BaseModel):
    answer: str
    sources: list[str]


@router.post("/chat", response_model=ChatResponse)
async def chat(
    request: ChatRequest,
    http_request: Request,
    remaining: int = Depends(chat_rate_limiter)
):
    try:
        # Sanitize the query
        sanitized_query = sanitizer.sanitize_query(request.query)
        
        # Sanitize conversation history
        sanitized_history = []
        for msg in request.conversation_history[-6:]:  # Limit to last 6 messages
            sanitized_history.append({
                "role": msg.get("role", "user"),
                "content": sanitizer.sanitize_string(msg.get("content", ""))
            })
        
        result = chat_service.chat(sanitized_query, sanitized_history)
        return ChatResponse(**result)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        # Log the error for debugging
        import logging
        logger = logging.getLogger(__name__)
        logger.error(f"Chat error: {str(e)}", exc_info=True)
        
        raise HTTPException(
            status_code=500, 
            detail="I'm having trouble processing your question right now. Please try again in a moment."
        )

