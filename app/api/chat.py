# chat endpoints
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.rag.chat_services import ChatService

router = APIRouter()
chat_service = ChatService()


class ChatRequest(BaseModel):
    query: str
    conversation_history: list[dict] = []


class ChatResponse(BaseModel):
    answer: str
    sources: list[str]


@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    try:
        result = chat_service.chat(request.query, request.conversation_history)
        return ChatResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing chat request: {str(e)}")

