# ProfileRAG 🤖

> An AI-powered interactive portfolio that lets visitors ask questions through natural conversation. Built to showcase expertise in RAG systems, LLM integration, and production-grade full-stack development.

## 🌐 Live Demo

**[ganabattumur.com](https://ganabattumur.com)** - Try asking the AI about my experience!

## 🎯 The Problem

Traditional portfolios are static and require visitors to manually search for information. Recruiters and collaborators waste time hunting through multiple sections to find specific details about skills, experience, or availability.

## 💡 The Solution

An intelligent portfolio that **answers questions in real-time** using Retrieval-Augmented Generation (RAG):

- "What AI projects has Gana built?"
- "Does he have experience with FastAPI?"
- "Is he open to relocation?"

The system retrieves relevant context from my resume and portfolio documents, then generates personalized, conversational responses using GPT-4.

## ⚡ Key Features

### 🧠 Production RAG Pipeline
- **Semantic Search**: FAISS vector database with OpenAI embeddings
- **Smart Chunking**: Recursive text splitting preserving document context
- **Context-Aware**: Maintains conversation history for coherent multi-turn dialogue
- **Citation Support**: Returns source references for answer verification

### 🛡️ Enterprise-Grade Security
- **Input Sanitization**: HTML/script injection prevention
- **Rate Limiting**: Token-bucket algorithm prevents abuse (100 req/min)
- **CORS Configuration**: Secure cross-origin resource sharing
- **Environment Isolation**: Secrets management via environment variables

### 🎨 Modern Frontend
- **Responsive Design**: Mobile-first UI with Tailwind CSS
- **Real-Time Chat**: Instant responses with loading states
- **Pixel Art Animation**: Custom "Day in the Life" visualization
- **Dark/Light Themes**: User preference persistence

### 📧 Contact System
- **Email Integration**: Resend API for instant notifications
- **Spam Protection**: Rate limiting and input validation
- **Professional Templates**: HTML email formatting

## 🏗️ Architecture

```
┌─────────────────┐      HTTPS       ┌──────────────────┐
│                 │ ◄──────────────► │                  │
│  React Frontend │                  │  FastAPI Backend │
│   (Render CDN)  │                  │   (Render.com)   │
└─────────────────┘                  └──────────────────┘
                                              │
                                              ▼
                                     ┌─────────────────┐
                                     │  RAG Pipeline   │
                                     ├─────────────────┤
                                     │ 1. Embed Query  │
                                     │ 2. FAISS Search │
                                     │ 3. GPT Generate │
                                     └─────────────────┘
```

## 🛠️ Tech Stack

### Backend
- **Framework**: FastAPI 0.128+ (async Python web framework)
- **AI/ML**: OpenAI GPT-4, text-embedding-3-small
- **Vector DB**: FAISS (Facebook AI Similarity Search)
- **Document Processing**: PyPDF for resume parsing
- **Validation**: Pydantic v2 for request/response schemas
- **Rate Limiting**: SlowAPI with Redis-compatible backends

### Frontend
- **Framework**: React 18 with Vite for fast HMR
- **Styling**: Tailwind CSS with custom design system
- **Icons**: Lucide React for consistent iconography
- **HTTP Client**: Native Fetch API with retry logic

### Infrastructure
- **Hosting**: Render.com (separate services for frontend/backend)
- **Domain**: Custom domain with SSL/TLS
- **CDN**: Automatic via Render static site hosting
- **Monitoring**: Google Analytics for user insights

## 📂 Project Structure

```
ProfileRAG/
├── app/
│   ├── api/                 # REST API endpoints
│   │   ├── chat.py          # Chat endpoint with RAG integration
│   │   ├── contact.py       # Contact form with email notifications
│   │   └── health.py        # Health check endpoint
│   ├── rag/                 # RAG pipeline components
│   │   ├── embeddings.py    # OpenAI embedding generation
│   │   ├── retriever.py     # FAISS similarity search
│   │   ├── chat_services.py # LLM prompt engineering & generation
│   │   ├── chunking.py      # Document text splitting
│   │   └── ingest.py        # Document processing pipeline
│   ├── llm/                 # LLM utilities
│   │   ├── client.py        # OpenAI client wrapper
│   │   └── guards.py        # Input/output filtering
│   └── core/                # Core utilities
│       ├── config.py        # Environment configuration
│       ├── security.py      # Rate limiting & sanitization
│       └── prompts.py       # LLM prompt templates
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── data/            # Static profile data
│   │   └── api.js           # Backend API client
│   └── public/              # Static assets
├── data/
│   ├── raw/                 # Source documents (PDFs, MD)
│   ├── processed/           # Cleaned text chunks
│   └── embeddings/          # FAISS index & metadata
├── scripts/
│   └── ingest_docs.py       # Document ingestion script
└── tests/                   # Unit & integration tests
```

## 🚀 Technical Highlights

### RAG Implementation
- **Embedding Model**: OpenAI text-embedding-3-small (1536 dimensions)
- **Chunk Strategy**: Recursive splitting with 800-char chunks, 200-char overlap
- **Retrieval**: Top-5 semantic similarity search with L2 distance
- **Generation**: GPT-4 with system prompts for personality consistency
- **Memory**: Conversation history (last 6 messages) for context

### Performance Optimizations
- **Cold Start Handling**: Exponential backoff retry logic (2s, 4s, 8s)
- **Lazy Loading**: Vector index loaded on-demand
- **Response Streaming**: Future enhancement for faster perceived latency
- **Caching**: Static assets served via CDN with 1-year max-age

### Code Quality
- **Type Safety**: Python type hints throughout
- **Error Handling**: Structured exception handling with proper HTTP status codes
- **Logging**: Structured logging for debugging and monitoring
- **Testing**: Pytest suite for API endpoints (future: 80%+ coverage goal)

## 📊 What This Project Demonstrates

✅ **RAG System Design** - End-to-end implementation from document ingestion to response generation  
✅ **Production Backend** - FastAPI with proper validation, security, and error handling  
✅ **Modern Frontend** - React with thoughtful UX and responsive design  
✅ **API Design** - RESTful endpoints with clear contracts and documentation  
✅ **DevOps** - Environment management, deployment automation, monitoring  
✅ **Security Awareness** - Input sanitization, rate limiting, CORS, secrets management  

## 🔐 Security & Privacy

This repository is **open source for portfolio purposes**. Sensitive configuration (API keys, deployment manifests) has been removed from version control but maintained locally for operational use.

- ✅ Environment variables for all secrets
- ✅ `.gitignore` prevents credential exposure
- ✅ Input validation prevents injection attacks
- ✅ Rate limiting prevents abuse
- ✅ CORS restricts unauthorized domains

## 📈 Future Enhancements

- [ ] Add response streaming for faster UX
- [ ] Implement conversation memory persistence
- [ ] Add multi-modal support (images, videos)
- [ ] Build analytics dashboard for visitor insights
- [ ] Enhance testing coverage to 80%+
- [ ] Add A/B testing for prompt optimization

## 👨‍💻 About Me

I'm Gana Battumur, an AI Engineer passionate about building practical LLM applications. This project showcases my ability to take an idea from concept to production deployment.

**Connect with me:**
- 🌐 Portfolio: [ganabattumur.com](https://ganabattumur.com)
- 💼 LinkedIn: [linkedin.com/in/gantumur-battumur](https://linkedin.com/in/gantumur-battumur)
- 📧 Email: [Available via portfolio contact form]

---

⭐ If this project helped you learn about RAG systems or inspired your own portfolio, consider starring the repo!
