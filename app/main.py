from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import chat, health, contact
from app.core.config import settings
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

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


@app.on_event("startup")
async def startup_event():
    """Pre-warm heavy components to avoid slow first request"""
    logger.info("Starting application warm-up...")
    
    try:
        # 1. Pre-load the embedding model (usually takes 20-30s)
        logger.info("Loading embedding model...")
        from app.rag.embeddings import get_model
        model = get_model()
        logger.info(f"✓ Embedding model loaded: {model}")
        
        # 2. Pre-initialize the retriever (loads FAISS index)
        logger.info("Loading FAISS index and metadata...")
        from app.api.chat import chat_service
        if chat_service.retriever is not None:
            logger.info(f"✓ Retriever initialized with {len(chat_service.retriever.metadata)} documents")
        else:
            logger.warning("⚠ Retriever not initialized - index files may be missing")
        
        # 3. Pre-warm OpenAI client with a test call (optional but recommended)
        logger.info("Testing OpenAI connection...")
        from app.llm.client import client
        # Just verify the client is ready - don't make an actual API call to save costs
        logger.info(f"✓ OpenAI client initialized")
        
        logger.info("🚀 Application warm-up complete! First request should be fast now.")
        
    except Exception as e:
        logger.error(f"Error during warm-up: {e}")
        # Don't fail startup, but log the error
        logger.warning("Application started but warm-up incomplete - first request may be slow")