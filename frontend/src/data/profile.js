export const projects = [
  {
    id: 1,
    title: "Mongolian LLM Benchmark",
    type: "ML Research",
    category: "Research",
    categories: ["Research"],
    year: "2025",
    description: "Created the first systematic benchmark for evaluating Mongolian Large Language Models. Built a reproducible evaluation pipeline using lm-evaluation-harness to test models on reasoning, knowledge, syntax, and semantics tasks — identifying a 30–40% performance gap vs. English baselines.",
    tech: [
      "Python",
      "lm-evaluation-harness",
      "Hugging Face",
      "Shell Scripting",
      "ML Benchmarking",
      "Cross-lingual NLP"
    ],
    image: "/mongolian-llm.svg",
    links: [
      { label: "Github", url: "https://github.com/gantumurbattumur/Mongolian-LLM-Leaderboard", type: "github" }
    ]
  },
  {
    id: 2,
    title: "AI Book Assistant",
    type: "RAG System",
    category: "RAG & AI",
    categories: ["RAG & AI"],
    year: "2025",
    description: "Advanced agentic RAG system for querying a personal book collection (PDFs/EPUBs). Uses a LangGraph state machine with conditional branching: retrieve → grade docs → adaptive query rewriting → web-search fallback (Tavily) → generate. Persistent ChromaDB vector index with a Typer/Rich CLI.",
    tech: [
      "Python",
      "LangChain",
      "LangGraph",
      "OpenAI GPT-3.5",
      "ChromaDB",
      "Tavily Search",
      "Typer",
      "Rich"
    ],
    links: [
      { label: "Github", url: "https://github.com/gantumurbattumur/ai-assistant", type: "github" }
    ]
  },
  {
    id: 3,
    title: "Mini Recon AI",
    type: "Full Stack",
    category: "Full Stack",
    categories: ["Full Stack"],
    year: "2025",
    description: "AI-powered trade reconciliation engine that compares custodian vs. internal book CSV files, detects mismatches (amount errors, missing trades), classifies exceptions, and generates batch AI explanations with recommended actions via Gemini 2.0 Flash — resolved through a professional dashboard.",
    tech: [
      "Python",
      "FastAPI",
      "Pandas",
      "Gemini 2.0 Flash",
      "JavaScript",
      "HTML/CSS",
      "REST APIs"
    ],
    image: "/mini-recon-ai.png",
    links: [
      { label: "Github", url: "https://github.com/gantumurbattumur/mini-recon-ai", type: "github" }
    ]
  },
  {
    id: 4,
    title: "LifeOS — Personal Analytics Platform",
    type: "Full Stack",
    category: "Full Stack",
    categories: ["Full Stack"],
    year: "2026",
    description: "Full-stack personal analytics platform that ingests data from health (Apple Health), finance (bank statements), media (Letterboxd), and location (OwnTracks) into a medallion data model (Bronze/Silver/Gold layers). Unified dashboard with charts, maps, and trend analysis.",
    tech: [
      "Python",
      "FastAPI",
      "SQLAlchemy",
      "PostgreSQL",
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Docker Compose",
      "Recharts",
      "Alembic"
    ],
    links: [
      { label: "Github", url: "https://github.com/gantumurbattumur/personal-life-dashboard", type: "github" }
    ]
  },
  {
    id: 5,
    title: "Easee Memo",
    type: "Full Stack",
    category: "Full Stack",
    categories: ["Full Stack", "RAG & AI"],
    year: "2025",
    description: "AI-powered Memory Palace app combining ancient mnemonic science with modern AI. Users define memory palace locations; Gemini generates vivid narrative stories linking topics to each spot. Sentence-Transformers score recall accuracy and provide semantic feedback — deployed and live.",
    tech: [
      "React (Vite)",
      "Tailwind CSS",
      "FastAPI",
      "Sentence-Transformers",
      "Gemini API",
      "PostgreSQL",
      "Render",
      "Vercel"
    ],
    image: "/easeememo.jpeg",
    links: [
      { label: "Github", url: "https://github.com/gantumurbattumur/EaseeMemo", type: "github" },
      { label: "Live", url: "https://easee-memo.vercel.app/", type: "live" }
    ]
  },
  {
    id: 6,
    title: "EaseeVocab",
    type: "Full Stack",
    category: "Full Stack",
    categories: ["Full Stack", "RAG & AI"],
    year: "2025",
    description: "AI vocabulary learning app serving daily personalized word sets (A1–B2 level) with mnemonic sound-a-likes, Gemini-generated visual memory stories, crossword puzzles, streaks, and XP. Production app scaled to 2,000+ active users with full auth, progress tracking, and gamification.",
    tech: [
      "Next.js 14",
      "TypeScript",
      "Tailwind CSS",
      "FastAPI",
      "PostgreSQL",
      "Gemini API",
      "Supabase",
      "Vercel",
      "Railway"
    ],
    image: "/easeevocab.gif",
    links: [
      { label: "Github", url: "https://github.com/gantumurbattumur/EaseeVocab", type: "github" },
      { label: "Live", url: "https://easee-vocab.vercel.app/dashboard", type: "live" }
    ]
  },
  {
    id: 7,
    title: "Github-aware RAG",
    type: "VS Code Extension",
    category: "RAG & AI",
    categories: ["RAG & AI", "Tools"],
    year: "2026",
    description: "VS Code extension that enables semantic search across your own and starred GitHub repos — right inside the editor. A local FastAPI backend indexes and chunks code files into ChromaDB using OpenAI text-embedding-3-small. Query your entire code history from the sidebar while you code.",
    tech: [
      "Python",
      "TypeScript",
      "FastAPI",
      "ChromaDB",
      "OpenAI Embeddings",
      "VS Code API",
      "GitHub API",
      "Semantic Search"
    ],
    image: "/github-aware-extension.png",
    links: [
      { label: "Github", url: "https://github.com/gantumurbattumur/Github-aware-RAG", type: "github" },
    ]
  },
  {
    id: 8,
    title: "ProfileRAG - AI Portfolio",
    type: "Full Stack",
    category: "RAG & AI",
    categories: ["RAG & AI", "Full Stack"],
    year: "2026",
    image: "/profilerag.png",
    description: "This portfolio — a fully deployed AI-powered site where visitors chat directly with a RAG system trained on my resume and projects. FastAPI + FAISS + sentence-transformers backend; React/Vite/Tailwind frontend with a 3D model, theme toggle, and live experience cards. Cold start <3s on Render.",
    tech: [
      "Python",
      "FastAPI",
      "FAISS",
      "OpenAI GPT-4",
      "Sentence-Transformers",
      "React",
      "Vite",
      "Tailwind CSS",
      "Render"
    ],
    image: "/profilerag.png",
    links: [
      { label: "Github", url: "https://github.com/gantumurbattumur/ProfileRAG", type: "github" },
      { label: "Live", url: "https://ganabattumur.com/", type: "live" }
    ]
  }
];

export const skills = {
  "Programming Languages": ["Python", "JavaScript", "TypeScript", "SQL", "Java"],

  "Software Engineering": [
    "Data Structures & Algorithms",
    "Object-Oriented Design",
    "Modular Codebases",
    "Testing & Debugging",
    "Version Control (Git)"
  ],

  "Backend & APIs": [
    "FastAPI",
    "Node.js",
    "Express",
    "REST API Design",
    "Authentication & Authorization"
  ],

  "Databases & Data": [
    "PostgreSQL",
    "MongoDB",
    "Schema Design",
    "Query Optimization",
    "Data Validation"
  ],

  "Frontend": [
    "React",
    "Next.js",
    "HTML",
    "CSS",
    "Tailwind CSS"
  ],

  "AI & Machine Learning": [
    "PyTorch",
    "scikit-learn",
    "Model Training & Evaluation",
    "Feature Engineering",
    "Embedding-Based Retrieval"
  ],

  "LLMs & Applied AI": [
    "RAG Pipelines",
    "Prompt Engineering",
    "LangChain",
    "Vector Databases (Pinecone, ChromaDB)",
    "OpenAI / Hugging Face APIs"
  ],

  "DevOps & Tooling": [
    "Docker",
    "CI/CD",
    "AWS (Basics)",
    "GitHub Actions",
    "ML Experiment Tracking (MLflow)"
  ]
};


export const experience = [
  {
    id: 1,
    title: "Software Engineer Contractor",
    company: "F5 Networks",
    location: "Liberty Lake, WA",
    period: "June 2024 - Oct 2024",
    description: " Collaborated with a 4-person team to refactor API endpoints in Python, reducing average response time by 25% and eliminating 3 recurring bugs. Wrote unit and integration tests with Jest, achieving 85% coverage on new code. Participated in daily stand-ups, sprint planning, and code reviews using GitHub PRs. Implemented structured logging, metrics collection, and alerting to support reproducible debugging and analysis. ",
    tech: "Python, internal automation frameworks, data logging pipelines, monitoring dashboards"
  },
  {
    id: 2,
    title: "Software Engineer",
    company: "Seattle Mongolian Youth Center",
    location: "Seattle, WA",
    period: "Nov 2024 - Feb 2026",
    description: "Built a full-stack customer portal using Next.js (frontend) + Python/FastAPI (backend), enabling self-service data exports and reducing support tickets by ~30%. Designed and implemented RESTful APIs that serve 500+ requests daily using a PostgreSQL database. Containerized application components with Docker and deployed to AWS EC2, improving deployment speed from hours to minutes. Assisted in migrating code to a microservices architecture, focusing on the authentication module with JWT. Conducted code reviews and pair programming sessions, contributing to team knowledge sharing.",
    tech: "React, TypeScript, FastAPI, PostgreSQL, Python, Docker, AWS"
  },
  {
    id: 3,
    title: "Teacher Assistant",
    company: "Whitworth University CS Department",
    location: "Spokane, WA",
    period: "Sept 2023 - May 2024",
    description: "Led weekly lab sessions and office hours for 50+ students, guiding C++ programming, algorithms, and problem-solving strategies, debugging complex algorithmic problems, and ensuring timely progress tracking.",
    tech: "C++, Python, data structures, algorithms, mentoring, leadership, team coordination"
  }];

export const contact = {
  email: "ganabattumur@gmail.com",
  phone: "509-251-6832",
  location: "Seattle, WA",
  links: [
    { label: "LinkedIn", url: "https://linkedin.com/in/gantumur-battumur/" },
    { label: "GitHub", url: "https://github.com/gantumurbattumur/" },
    { label: "Email", url: "mailto:ganabattumur@gmail.com" },
    { label: "Portfolio", url: "https://ganabattumur.com/" }
  ]
};

export const resume = {
  url: "https://drive.google.com/file/d/18WkAdMRT-X6wkMVlC8c9xG6ZbU2xDXY3/view?usp=sharing",
  lastUpdated: "March 2026"
};
