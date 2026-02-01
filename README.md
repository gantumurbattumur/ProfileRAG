# ProfileRAG

An AI-powered portfolio that lets visitors ask questions about me through a chat interface. Built to demonstrate my skills in RAG systems, full-stack development, and LLM integration.

## 🌐 Live Demo

**[ganabattumur.com](https://ganabattumur.com)**

## Why I Built This

Traditional portfolios are static—visitors have to hunt through sections to find what they're looking for. I wanted something different: **a portfolio that talks back**.

Instead of making recruiters scroll through pages, they can simply ask:
- "What are Gana's strongest technical skills?"
- "Tell me about his AI projects"
- "Is he open to relocation?"

The system retrieves relevant information from my resume and documents, then generates natural conversational answers using GPT.

## What This Demonstrates

**RAG (Retrieval-Augmented Generation)**
- Document ingestion and chunking pipeline
- Semantic search using sentence-transformers and FAISS
- Context-aware response generation with conversation history

**Full-Stack Development**
- FastAPI backend with async endpoints
- React frontend with warm, minimal UI design
- Real-time chat interface with pixel art animation

**Production Practices**
- Input sanitization and rate limiting
- Environment-based configuration
- Structured logging and error handling
- Startup pre-warming for instant first response (< 3s)

## Tech Stack

- **Backend**: Python, FastAPI, LangChain, FAISS, Sentence-Transformers
- **Frontend**: React, Vite, Tailwind CSS
- **AI**: OpenAI GPT-4, RAG pipeline
- **Deployment**: Render (backend + frontend)

## Quick Start (Local Development)

```bash
# Clone the repo
git clone https://github.com/gantumurbattumur/ProfileRAG.git
cd ProfileRAG

# Backend setup
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

# Set up environment
cp .env.example .env
# Edit .env with your OPENAI_API_KEY

# Ingest documents
python scripts/ingest_docs.py

# Run backend
uvicorn app.main:app --reload --port 8000

# Frontend (new terminal)
cd frontend
npm install
npm run dev
```

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions on deploying to Render, Railway, or Fly.io.

## Performance

First request is now optimized to respond in **~3 seconds** (vs. 60s before). See [docs/FIRST_REQUEST_FIX.md](./docs/FIRST_REQUEST_FIX.md) for details on the startup pre-warming implementation.

---

Built by [Gana Battumur](https://linkedin.com/in/gantumur-battumur/)
