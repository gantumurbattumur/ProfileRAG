# Lightweight embedding generation using OpenAI API
import numpy as np
from openai import OpenAI
from app.core.config import settings

_client = None

def get_client():
    """Get cached OpenAI client."""
    global _client
    if _client is None:
        _client = OpenAI(api_key=settings.OPENAI_API_KEY)
    return _client

def embed_query(query: str) -> np.ndarray:
    """
    Generate embedding for user query using OpenAI API.
    Uses text-embedding-3-small (62M params, fast, cheap).
    """
    client = get_client()
    response = client.embeddings.create(
        model="text-embedding-3-small",
        input=query,
        dimensions=1536  # Standard dimension for text-embedding-3-small
    )
    embedding = response.data[0].embedding
    return np.asarray([embedding], dtype="float32")
