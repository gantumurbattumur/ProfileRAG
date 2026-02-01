# embedding generation
from sentence_transformers import SentenceTransformer
import numpy as np
from dotenv import load_dotenv
import os

load_dotenv()
MODEL_NAME = os.getenv("EMBEDDING_MODEL_NAME", "sentence-transformers/all-MiniLM-L6-v2")

# Cache the model to avoid reloading on every call
_model_cache = None

def get_model():
    global _model_cache
    if _model_cache is None:
        _model_cache = SentenceTransformer(MODEL_NAME)
    return _model_cache

def embed_docs(texts: list[str]) -> np.ndarray:
    model = get_model()
    embeddings = model.encode(texts, normalize_embeddings=True)
    return np.asarray(embeddings, dtype="float32")

def embed_query(query: str) -> np.ndarray:
    model = get_model()
    query_emb = model.encode([query], normalize_embeddings=True)
    return np.asarray(query_emb, dtype="float32")