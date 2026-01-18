#!/usr/bin/env python3
"""
Script to ingest documents from data/raw and create embeddings index.
Run this script after adding new documents to data/raw/ directory.
"""
import sys
from pathlib import Path

# Add parent directory to path to import app modules
sys.path.insert(0, str(Path(__file__).parent.parent))

from app.rag.ingest import ingest_docs

if __name__ == "__main__":
    try:
        ingest_docs()
        print("✅ Document ingestion completed successfully!")
    except Exception as e:
        print(f"❌ Error during ingestion: {e}")
        sys.exit(1)
