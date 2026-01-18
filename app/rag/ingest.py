from pathlib import Path
import json
import faiss
import numpy as np
from pypdf import PdfReader
from app.rag.embeddings import embed_docs
from app.rag.chunking import chunk_text

DATA_DIR = Path("data")
RAW_DIR = DATA_DIR / "raw"
EMBED_DIR = DATA_DIR / "embeddings"

INDEX_PATH = EMBED_DIR / "index.faiss"
META_PATH = EMBED_DIR / "metadata.json"


def extract_text_from_pdf(pdf_path: Path) -> str:
    """Extract text from PDF file."""
    try:
        reader = PdfReader(str(pdf_path))
        text_parts = []
        for page in reader.pages:
            page_text = page.extract_text()
            if page_text:
                text_parts.append(page_text)
        return "\n".join(text_parts)
    except Exception as e:
        print(f"Error reading PDF {pdf_path}: {e}")
        return ""


def ingest_docs():
    """Ingest documents from data/raw directory and create embeddings."""
    EMBED_DIR.mkdir(parents=True, exist_ok=True)
    
    if not RAW_DIR.exists():
        raise FileNotFoundError(f"Raw data directory not found: {RAW_DIR}")

    texts = []
    metadata = []

    # Process markdown files
    for file in RAW_DIR.glob("*.md"):
        # be tolerant of encoding issues
        try:
            text = file.read_text(encoding="utf-8", errors="ignore")
        except Exception as e:
            print(f"Warning: could not read {file}: {e}")
            continue
        chunks = chunk_text(text)
        for chunk in chunks:
            texts.append(chunk)
            metadata.append({
                "source": str(file.name),
                "text": chunk
            })

    # Process PDF files
    for file in RAW_DIR.glob("*.pdf"):
        text = extract_text_from_pdf(file)
        if text.strip():
            chunks = chunk_text(text)
            for chunk in chunks:
                texts.append(chunk)
                metadata.append({
                    "source": str(file.name),
                    "text": chunk
                })

    if not texts:
        raise ValueError(f"No documents found in {RAW_DIR}. Please add some documents (.md or .pdf files).")

    print(f"Processing {len(texts)} chunks from {len(list(RAW_DIR.glob('*.*')))} files...")
    
    # Generate embeddings
    try:
        embeddings = embed_docs(texts)
    except Exception as e:
        raise RuntimeError(f"Failed to generate embeddings: {e}")

    # Ensure embeddings is a 2D numpy array of float32
    if isinstance(embeddings, list):
        embeddings = np.array(embeddings)
    if not isinstance(embeddings, np.ndarray):
        raise TypeError("Embeddings must be a numpy array or list of vectors.")
    if embeddings.ndim != 2:
        raise ValueError(f"Embeddings must be 2-dimensional (n_vectors, dim). Got shape: {embeddings.shape}")

    # Convert to float32 for FAISS
    if embeddings.dtype != np.float32:
        embeddings = embeddings.astype(np.float32)

    # Create FAISS index
    dim = int(embeddings.shape[1])
    if embeddings.shape[0] == 0:
        raise ValueError("No embeddings to index.")

    # Ensure C-contiguous float32 array for FAISS
    embeddings = np.ascontiguousarray(embeddings, dtype=np.float32)

    index = faiss.IndexFlatIP(dim)  # Inner product for normalized embeddings
    try:
        index.add(embeddings)  # type: ignore[arg-type]
    except Exception as e:
        raise RuntimeError(f"Failed to add embeddings to FAISS index: {e}")

    # Save index and metadata
    try:
        faiss.write_index(index, str(INDEX_PATH))
        with open(META_PATH, "w", encoding="utf-8") as f:
            json.dump(metadata, f, indent=2, ensure_ascii=False)
    except Exception as e:
        raise RuntimeError(f"Failed to save index or metadata: {e}")
    
    print(f"Successfully created index with {len(texts)} chunks!")
    print(f"Index saved to: {INDEX_PATH}")
    print(f"Metadata saved to: {META_PATH}")


if __name__ == "__main__":
    ingest_docs()
