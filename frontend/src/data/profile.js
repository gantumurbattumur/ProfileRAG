export const projects = [
  {
    id: 1,
    title: "AI Vocabulary Learning Tool",
    type: "Full Stack",
    category: "AI/ML",
    year: "2025",
    description: "Built a Generative AI application using LLMs and retrieval-augmented generation (RAG) for stories and images for personalized vocabulary learning. Designed a full-stack AI system with a Next.js frontend, FastAPI backend, and PostgreSQL for the database.",
    tech: ["Python", "FastAPI", "Next.js", "PostgreSQL", "Gemini API", "RAG", "Docker", "REST APIs"],
    image: "/easeevocab.gif",
    links: [
      { label: "Github", url: "https://github.com/gantumurbattumur/EaseeVocab", type: "github" },
      { label: "Live", url: "https://easee-vocab.vercel.app/dashboard", type: "live" }
    ]
  },
  {
    id: 2,
    title: "Easee Memo",
    type: "Full Stack",
    category: "AI/ML",
    year: "2025",
    description: "Built an AI-powered web application that enhances memory training using the Memory Palace technique combined with modern AI storytelling and feedback systems. Designed a guided experience where users visualize memory palaces, generate vivid AI-crafted narratives, and receive semantic feedback to reinforce recall.",
    tech: [
      "React (Vite)",
      "Tailwind CSS",
      "React Router",
      "FastAPI",
      "Sentence-Transformers",
      "Gemini API",
      "PostgreSQL",
      "Render",
      "Vercel",
      "AI Feedback Systems",
      "REST APIs"
    ],
    image: "/easeememo.jpeg",
    links: [
      { label: "Github", url: "https://github.com/gantumurbattumur/EaseeMemo", type: "github" },
      { label: "Live", url: "https://easee-memo.vercel.app/", type: "live" }
    ]
  },
  {
    id: 3,
    title: "Mini Recon AI",
    type: "Full Stack",
    category: "AI/ML",
    year: "2025",
    description: "Built an AI-powered trade reconciliation engine that compares financial trade records, detects mismatches, generates AI explanations, and allows exception resolution through a professional dashboard. Demonstrates understanding of reconciliation workflows, backend problem-solving, and AI-assisted business operations.",
    tech: [
      "Python",
      "FastAPI",
      "Pandas",
      "Gemini 2.0 Flash",
      "JavaScript",
      "HTML/CSS",
      "REST APIs",
      "Data Engineering"
    ],
    image: "/mini-recon-ai.png",
    links: [
      { label: "Github", url: "https://github.com/gantumurbattumur/mini-recon-ai", type: "github" }
    ]
  },
  {
    id: 4,
    title: "Mongolian LLM Benchmark",
    type: "ML Research",
    category: "AI/ML",
    year: "2025",
    description: "Created the first systematic benchmark for evaluating Mongolian Large Language Models. Built a reproducible evaluation pipeline using lm-evaluation-harness to test models on reasoning, knowledge, syntax, and semantics tasks. Identified 30-40% performance gaps vs English baselines, providing open-source results for the ML community.",
    tech: [
      "Python",
      "lm-evaluation-harness",
      "Hugging Face",
      "Shell Scripting",
      "ML Benchmarking",
      "Cross-lingual NLP"
    ],
    image: "/mongolian-llm.svg", // Benchmark comparison chart
    links: [
      { label: "Github", url: "https://github.com/gantumurbattumur/Mongolian-LLM-Leaderboard", type: "github" }
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
    title: "Software Engineer Intern",
    company: "F5 Networks",
    location: "Liberty Lake, WA",
    period: "June 2024 - Oct 2024",
    description: " Automated Power Supply Unit validation and diagnostics workflows, reducing manual QA testing by approximately 70 percent and preventing recurring calibration failures. Developed Python-based automation for hardware calibration, fault detection, and structured data logging to support reproducible validation and debugging.",
    tech: "Python, internal automation frameworks, data logging pipelines, monitoring dashboards"
  },
  {
    id: 2,
    title: "Software Engineer Intern",
    company: "Memory Sports Association",
    location: "Remote",
    period: "Jan 2025 - Aug 2025",
    description: "Built and maintained a production web application that scaled to over two thousand active users, contributing across frontend, backend, and data layers. Designed data models and retrieval logic to reduce query latency and improve responsiveness. Implemented backend APIs and database optimizations to support interaction tracking and content delivery. Developed interactive frontend components to enhance user experience and engagement. ",
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
    { label: "Portfolio", url: "https://github.com/gantumurbattumur/" }
  ]
};

export const resume = {
  url: "https://drive.google.com/file/d/1547j7BIdzrQ9LLNGqwjECn825oSreLVo/view?usp=sharing", // Replace with actual resume URL
  lastUpdated: "January 2026"
};
