from fastapi import APIRouter
from app.rag.retriever import get_retriever
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

@router.get("/")
def health_check():
    return {"status": "healthy"}

@router.get("/health")
async def health_check_endpoint():
    """Health check endpoint that warms up FAISS index for fast user queries."""
    try:
        # Trigger lazy loading of FAISS index to keep it in memory
        retriever = get_retriever()
        
        return {
            "status": "healthy",
            "service": "ProfileRAG API",
            "documents_loaded": len(retriever.metadata) if retriever.metadata else 0
        }
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        return {
            "status": "degraded",
            "service": "ProfileRAG API",
            "error": str(e)
        }
