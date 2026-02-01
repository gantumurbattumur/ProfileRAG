import json
import numpy as np
import faiss
from pathlib import Path
from app.rag.embeddings import embed_query

INDEX_PATH = Path("data/embeddings/index.faiss")
META_PATH = Path("data/embeddings/metadata.json")

# Lazy loading cache
_retriever_instance = None

class Retriever:
    def __init__(self):
        if not INDEX_PATH.exists() or not META_PATH.exists():
            raise FileNotFoundError(
                f"Index files not found. Please run the ingestion script first. "
                f"Expected files: {INDEX_PATH}, {META_PATH}"
            )
        # Lazy load - only load when first query happens
        self.index = None
        self.metadata = None

    def _ensure_loaded(self):
        """Load index and metadata on first use."""
        if self.index is None:
            self.index = faiss.read_index(str(INDEX_PATH))
            with open(META_PATH, "r") as f:
                self.metadata = json.load(f)

    def retrieve(self, query: str, top_k: int = 3):
        self._ensure_loaded()
        query_emb = embed_query(query)
        scores, indices = self.index.search(query_emb, top_k)

        results = []
        for idx, score in zip(indices[0], scores[0]):
            # Handle invalid indices (faiss returns -1 for empty indices)
            if idx >= 0 and idx < len(self.metadata):
                metadata_item = self.metadata[idx]
                results.append({
                    "text": metadata_item.get("text", ""),
                    "score": float(score),
                    "source": metadata_item.get("source", "unknown")
                })

        return results

def get_retriever():
    """Get cached retriever instance (lazy loaded)."""
    global _retriever_instance
    if _retriever_instance is None:
        _retriever_instance = Retriever()
    return _retriever_instance