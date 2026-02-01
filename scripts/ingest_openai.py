#!/usr/bin/env python3
"""
OFFLINE SCRIPT: Generate embeddings using OpenAI API.
Run this LOCALLY, then commit the generated files to git.

This eliminates the need for sentence-transformers at runtime.
"""
import sys
from pathlib import Path
import json
import faiss
import numpy as np
from openai import OpenAI
from dotenv import load_dotenv
import os

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from app.rag.chunking import chunk_text
from pypdf import PdfReader

load_dotenv()

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

def process_json_file(file_path: Path) -> list:
    """Process JSON file and return list of chunks with metadata."""
    results = []
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            data = json.load(f)
        
        if isinstance(data, list):
            for item in data:
                if isinstance(item, dict):
                    text_parts = []
                    if "question" in item:
                        text_parts.append(f"Q: {item['question']}")
                    if "answer" in item:
                        text_parts.append(f"A: {item['answer']}")
                    
                    if text_parts:
                        text = "\n".join(text_parts)
                        meta = {
                            "source": str(file_path.name),
                            "text": text,
                        }
                        for key in ["id", "category", "topic", "audience", "role", "seniority"]:
                            if key in item:
                                meta[key] = item[key]
                        results.append(meta)
        
        elif isinstance(data, dict):
            if "content" in data:
                text = data["content"]
                results.append({
                    "source": str(file_path.name),
                    "text": text,
                    **{k: v for k, v in data.items() if k != "content"}
                })
    except Exception as e:
        print(f"Error reading JSON {file_path}: {e}")
    
    return results

def embed_batch_openai(texts: list[str], client: OpenAI) -> np.ndarray:
    """Generate embeddings using OpenAI API."""
    print(f"  Generating {len(texts)} embeddings via OpenAI API...")
    response = client.embeddings.create(
        model="text-embedding-3-small",
        input=texts,
        dimensions=1536
    )
    embeddings = [item.embedding for item in response.data]
    return np.asarray(embeddings, dtype="float32")

def main():
    """Generate embeddings and FAISS index using OpenAI."""
    EMBED_DIR.mkdir(parents=True, exist_ok=True)
    
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        print("❌ Error: OPENAI_API_KEY not found in environment")
        sys.exit(1)
    
    client = OpenAI(api_key=api_key)
    
    if not RAW_DIR.exists():
        raise FileNotFoundError(f"Raw data directory not found: {RAW_DIR}")

    texts = []
    metadata = []

    # Process markdown files
    print("📄 Processing markdown files...")
    for file in RAW_DIR.glob("*.md"):
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
    print("📑 Processing PDF files...")
    for file in RAW_DIR.glob("*.pdf"):
        text = extract_text_from_pdf(file)
        if text:
            chunks = chunk_text(text)
            for chunk in chunks:
                texts.append(chunk)
                metadata.append({
                    "source": str(file.name),
                    "text": chunk
                })
    
    # Process JSON files
    print("🗂️  Processing JSON files...")
    for file in RAW_DIR.glob("*.json"):
        items = process_json_file(file)
        for item in items:
            texts.append(item["text"])
            metadata.append(item)
    
    if not texts:
        print("❌ No documents found to process")
        sys.exit(1)
    
    print(f"\n✅ Found {len(texts)} text chunks")
    
    # Generate embeddings using OpenAI
    print(f"\n🔄 Generating embeddings using OpenAI text-embedding-3-small...")
    embeddings = embed_batch_openai(texts, client)
    
    # Create FAISS index
    print("🔍 Creating FAISS index...")
    dimension = embeddings.shape[1]
    index = faiss.IndexFlatIP(dimension)  # Inner product (cosine similarity)
    
    # Normalize embeddings for cosine similarity
    faiss.normalize_L2(embeddings)
    index.add(embeddings)
    
    # Save index and metadata
    print(f"💾 Saving index to {INDEX_PATH}...")
    faiss.write_index(index, str(INDEX_PATH))
    
    print(f"💾 Saving metadata to {META_PATH}...")
    with open(META_PATH, "w") as f:
        json.dump(metadata, f, indent=2)
    
    print(f"\n✅ Successfully created embeddings for {len(texts)} chunks!")
    print(f"   Index dimension: {dimension}")
    print(f"   Index file size: {INDEX_PATH.stat().st_size / 1024:.1f} KB")
    print(f"\n💡 Commit these files to git:")
    print(f"   - {INDEX_PATH}")
    print(f"   - {META_PATH}")

if __name__ == "__main__":
    main()
