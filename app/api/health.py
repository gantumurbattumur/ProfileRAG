from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def health_check():
    return {"status": "healthy"}

@router.get("/health")
async def health_check_endpoint():
    """Health check endpoint for monitoring services like GitHub Actions."""
    return {
        "status": "healthy",
        "service": "ProfileRAG API"
    }
