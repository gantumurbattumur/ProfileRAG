# ProfileRAG

A RAG (Retrieval-Augmented Generation) system trained on personal documents to provide chat-style answers about your background, skills, and experience. Perfect for showcasing your profile to recruiters.

## Features

- 🤖 Chat interface to interact with your personal documents
- 📄 Supports both PDF and Markdown documents
- 🔍 Semantic search using sentence transformers and FAISS
- 💬 Conversation history support
- 🎨 Modern, responsive UI with dark mode

## Setup

### 1. Install Dependencies

**Using uv (recommended):**
```bash
# Create/update venv
uv venv .venv

# Activate venv
source .venv/bin/activate

# Install dependencies
uv pip install -r requirements.txt
```

**Or using standard pip:**
```bash
pip install -r requirements.txt
```

### 2. Environment Configuration

Create a `.env` file in the root directory:

```env
OPENAI_API_KEY=your_openai_api_key_here
MODEL_NAME=gpt-3.5-turbo
EMBEDDING_MODEL_NAME=sentence-transformers/all-MiniLM-L6-v2
```

### 3. Prepare Documents

Place your documents (PDFs or Markdown files) in the `data/raw/` directory.

### 4. Ingest Documents

Run the ingestion script to process your documents and create the embeddings index:

```bash
python scripts/ingest_docs.py
```

Or directly:

```bash
python -m app.rag.ingest
```

### 5. Start the Backend

```bash
uvicorn app.main:app --reload
```

The API will be available at `http://127.0.0.1:8000`

### 6. Start the Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173`

## Usage

1. Open the frontend in your browser
2. Ask questions about your background, skills, experience, or projects
3. Click action cards for quick queries (Me, Projects, Skills, Experience, Contact)
4. The system will retrieve relevant information from your documents and generate contextual answers

## Project Structure

```
ProfileRAG/
├── app/
│   ├── api/          # FastAPI endpoints
│   ├── core/         # Configuration and utilities
│   ├── llm/          # LLM client abstraction
│   ├── rag/          # RAG components (ingest, retriever, embeddings)
│   └── main.py       # FastAPI application
├── data/
│   ├── raw/          # Place your documents here
│   └── embeddings/   # Generated FAISS index and metadata
├── frontend/         # React frontend
└── scripts/          # Utility scripts
```

## API Endpoints

- `GET /` - Health check
- `POST /chat` - Send a chat message

### Chat Request

```json
{
  "query": "What are your technical skills?",
  "conversation_history": []
}
```

### Chat Response

```json
{
  "answer": "Based on my documents...",
  "sources": ["resume.pdf", "test_doc.md"]
}
```

## Notes

- Make sure to run the ingestion script after adding new documents
- The embedding model will be downloaded on first use
- Conversation history is maintained in the frontend for context
