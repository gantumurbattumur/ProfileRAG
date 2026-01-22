# embedding generation
import numpy as np
from dotenv import load_dotenv
import os
import logging
from openai import OpenAI

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

load_dotenv()

# Use OpenAI embeddings (lightweight - no heavy model to load)
OPENAI_EMBEDDING_MODEL = "text-embedding-3-small"

# Initialize OpenAI client
_client = None

def get_client():
    global _client
    if _client is None:
        _client = OpenAI()
        logger.info("OpenAI client initialized for embeddings")
    return _client

def embed_docs(texts: list[str]) -> np.ndarray:
    """Embed multiple documents using OpenAI API"""
    client = get_client()
    response = client.embeddings.create(
        model=OPENAI_EMBEDDING_MODEL,
        input=texts
    )
    embeddings = [item.embedding for item in response.data]
    return np.asarray(embeddings, dtype="float32")

def embed_query(query: str) -> np.ndarray:
    """Embed a single query using OpenAI API"""
    client = get_client()
    response = client.embeddings.create(
        model=OPENAI_EMBEDDING_MODEL,
        input=[query]
    )
    return np.asarray([response.data[0].embedding], dtype="float32")