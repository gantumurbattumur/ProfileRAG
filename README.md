# ProfileRAG

An AI-powered portfolio that lets visitors ask questions about me through a chat interface. Built to demonstrate my skills in RAG systems, full-stack development, and LLM integration.

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
- Real-time chat interface

**Production Practices**
- Input sanitization and rate limiting
- Environment-based configuration
- Structured logging and error handling

## Tech Stack

- **Backend**: Python, FastAPI, LangChain, FAISS, Sentence-Transformers
- **Frontend**: React, Vite, Tailwind CSS
- **AI**: OpenAI GPT-3.5, RAG pipeline
- **Other**: Docker-ready, pytest for testing

## Live Demo

[Coming soon]

---

Built by [Gana Battumur](https://linkedin.com/in/gantumur-battumur/)
