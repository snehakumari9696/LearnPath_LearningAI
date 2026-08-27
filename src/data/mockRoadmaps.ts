import { Roadmap } from '../types';

export const curatedCatalogRoadmaps: Roadmap[] = [
  {
    id: 'cat-ml-eng',
    title: 'Generative AI & LLM Systems Architect',
    skill: 'Generative AI & LLMs',
    summary: 'Master transformer architectures, fine-tuning techniques (LoRA, QLoRA), Vector DB indexing, RAG pipelines, and agentic workflows.',
    targetGoal: 'Build & Deploy Scalable Multi-Agent AI Systems',
    estimatedWeeks: 12,
    weeklyHours: 12,
    difficulty: 'Intermediate to Advanced',
    phases: [
      {
        phaseNumber: 1,
        title: 'Transformer Architecture & Self-Attention',
        duration: 'Weeks 1-3',
        description: 'Understand the core mechanics of transformers, positional encodings, multi-head attention, and tokenizer algorithms.',
        topics: ['Scaled Dot-Product Attention', 'Byte-Pair Encoding (BPE)', 'Decoder-Only vs Encoder-Decoder Models', 'Embeddings Space & Cosine Metric'],
        projects: [
          {
            name: 'Mini-GPT from Scratch in PyTorch',
            description: 'Build a character-level autoregressive transformer with custom causal self-attention masks and text generation loops.'
          }
        ],
        resources: [
          { name: 'Attention Is All You Need (Vaswani et al.)', type: 'Docs', url: 'https://arxiv.org/abs/1706.03762' },
          { name: 'Andrej Karpathy: Let’s build GPT', type: 'Video', url: 'https://www.youtube.com/watch?v=kCc8FmEb1nY' }
        ]
      },
      {
        phaseNumber: 2,
        title: 'RAG Architectures & Vector Search',
        duration: 'Weeks 4-7',
        description: 'Design production-grade Retrieval-Augmented Generation systems with hybrid search, re-ranking, and chunking heuristics.',
        topics: ['Dense vs Sparse Vector Indexing (HNSW)', 'Chunking Strategies & Context Windows', 'Cross-Encoder Re-Ranking', 'Semantic Caching & Metadata Filtering'],
        projects: [
          {
            name: 'Enterprise Technical Documentation Assistant',
            description: 'Multi-document RAG search pipeline using ChromaDB/Pinecone with streaming citations and hallucinations guardrails.'
          }
        ],
        resources: [
          { name: 'LangChain & LlamaIndex Guides', type: 'Docs', url: 'https://docs.llamaindex.ai/' },
          { name: 'Pinecone Vector DB Masterclass', type: 'Course', url: 'https://www.pinecone.io/learn/' }
        ]
      },
      {
        phaseNumber: 3,
        title: 'Fine-Tuning & Parameter-Efficient Tuning (PEFT)',
        duration: 'Weeks 8-10',
        description: 'Learn quantization (4-bit/8-bit), LoRA, Direct Preference Optimization (DPO), and Reinforcement Learning from Human Feedback (RLHF).',
        topics: ['LoRA & QLoRA Mathematical Formulation', 'Instruction Tuning Datasets Format', 'DPO vs PPO Alignment', 'Evaluation with BLEU, ROUGE & LLM-as-a-Judge'],
        projects: [
          {
            name: 'Custom Domain-Specialized Code Reviewer Model',
            description: 'Fine-tune a 7B parameter open model on GitHub pull requests using Unsloth/Hugging Face TRL and benchmark validation.'
          }
        ],
        resources: [
          { name: 'Hugging Face PEFT Library', type: 'Docs', url: 'https://huggingface.co/docs/peft' },
          { name: 'Unsloth Fast Fine-Tuning Guide', type: 'Docs', url: 'https://unsloth.ai/' }
        ]
      },
      {
        phaseNumber: 4,
        title: 'Autonomous AI Agents & Production Deployment',
        duration: 'Weeks 11-12',
        description: 'Build tool-augmented agentic loops with function calling, stateful memory, structured outputs, and low-latency inference.',
        topics: ['ReAct Agent Pattern & Tool Calling', 'State Graphs with LangGraph / CrewAI', 'vLLM & TensorRT-LLM Inference Optimization', 'OpenTelemetry Tracing for LLM Calls'],
        projects: [
          {
            name: 'Autonomous Software Engineering Agent',
            description: 'Interactive agent that reads GitHub issues, inspects code files, runs automated unit tests, and submits bug-fix PRs.'
          }
        ],
        resources: [
          { name: 'LangGraph Documentation', type: 'Docs', url: 'https://langchain-ai.github.io/langgraph/' },
          { name: 'vLLM High-Throughput Serving Engine', type: 'GitHub', url: 'https://github.com/vllm-project/vllm' }
        ]
      }
    ]
  },
  {
    id: 'cat-fullstack-dev',
    title: 'Full-Stack Cloud & TypeScript Engineer',
    skill: 'Full-Stack TypeScript & Cloud',
    summary: 'Master high-performance React 19, TypeScript, scalable Node.js microservices, PostgreSQL, and serverless edge deployments.',
    targetGoal: 'Become a Senior Full-Stack Software Engineer',
    estimatedWeeks: 10,
    weeklyHours: 10,
    difficulty: 'Beginner to Intermediate',
    phases: [
      {
        phaseNumber: 1,
        title: 'Advanced TypeScript & Frontend Architecture',
        duration: 'Weeks 1-3',
        description: 'Strict TypeScript typing, modular design patterns, custom hooks, and Tailwind CSS design systems.',
        topics: ['Discriminated Unions & Generics', 'React 19 Actions & Transitions', 'Optimistic UI Updates', 'Client-side State Stores'],
        projects: [
          {
            name: 'Real-Time Collaborative Markdown Canvas',
            description: 'Full-featured collaborative note editor with live cursor sync, markdown rendering, and local offline cache.'
          }
        ],
        resources: [
          { name: 'React 19 Official Documentation', type: 'Docs', url: 'https://react.dev/' },
          { name: 'Total TypeScript by Matt Pocock', type: 'Course', url: 'https://www.totaltypescript.com/' }
        ]
      },
      {
        phaseNumber: 2,
        title: 'Backend Systems, APIs & Database Relational Modeling',
        duration: 'Weeks 4-7',
        description: 'High-throughput Node.js APIs, PostgreSQL schema design, Prisma/Drizzle ORM, and JWT authentication.',
        topics: ['Database Indexing & Normalization', 'RESTful API & RPC Guidelines', 'Session Tokens vs JWT & Refresh Tokens', 'Rate Limiting & CORS Policies'],
        projects: [
          {
            name: 'High-Scale Analytics Aggregation Engine',
            description: 'Event-driven telemetry backend ingesting thousands of tracking pings with Redis caching and PostgreSQL bulk inserts.'
          }
        ],
        resources: [
          { name: 'PostgreSQL Tutorial', type: 'Docs', url: 'https://www.postgresqltutorial.com/' },
          { name: 'Drizzle ORM Documentation', type: 'Docs', url: 'https://orm.drizzle.team/' }
        ]
      },
      {
        phaseNumber: 3,
        title: 'Containerization, CI/CD & Cloud Orchestration',
        duration: 'Weeks 8-10',
        description: 'Docker multi-stage builds, GitHub Actions pipelines, Kubernetes fundamentals, and cloud observability.',
        topics: ['Dockerizing Fullstack Node/React Apps', 'Automated Integration Testing', 'Cloud Run / AWS ECS Deployment', 'Prometheus & Grafana Metrics'],
        projects: [
          {
            name: 'Production SaaS Infrastructure with Automated CI/CD',
            description: 'Automated workflow deploying preview environments on PR creation and production cluster rolling deployments.'
          }
        ],
        resources: [
          { name: 'Docker Hands-On Labs', type: 'Course', url: 'https://labs.play-with-docker.com/' },
          { name: 'GitHub Actions Documentation', type: 'Docs', url: 'https://docs.github.com/actions' }
        ]
      }
    ]
  },
  {
    id: 'cat-data-science',
    title: 'Data Science & Applied Machine Learning',
    skill: 'Data Science & Analytics',
    summary: 'Turn raw messy data into actionable business intelligence and predictive models with Python, Pandas, SQL, and Scikit-Learn.',
    targetGoal: 'Land a High-Impact Data Scientist Role',
    estimatedWeeks: 10,
    weeklyHours: 8,
    difficulty: 'Beginner',
    phases: [
      {
        phaseNumber: 1,
        title: 'Python for Data Wrangling & SQL Analytics',
        duration: 'Weeks 1-3',
        description: 'Master advanced SQL queries (window functions, CTEs), Pandas cleaning, and exploratory visualization with Seaborn/Plotly.',
        topics: ['Advanced SQL Joins & Window Aggregations', 'Pandas Vectorized Transformation', 'Handling Missing Data & Outliers', 'Interactive Plotly Dashboards'],
        projects: [
          {
            name: 'Global E-Commerce Revenue & Cohort Analysis',
            description: 'Comprehensive business intelligence report identifying customer churn cohorts, LTV patterns, and revenue anomalies.'
          }
        ],
        resources: [
          { name: 'SQL for Data Analysis (Mode Analytics)', type: 'Course', url: 'https://mode.com/sql-tutorial/' },
          { name: 'Python Data Science Handbook (Jake VanderPlas)', type: 'Book', url: 'https://jakevdp.github.io/PythonDataScienceHandbook/' }
        ]
      },
      {
        phaseNumber: 2,
        title: 'Statistical Inference & Machine Learning Modeling',
        duration: 'Weeks 4-7',
        description: 'Hypothesis testing, A/B testing frameworks, supervised classification/regression, and feature selection.',
        topics: ['A/B Testing Statistical Power & P-Values', 'Random Forests & Gradient Boosted Trees (XGBoost)', 'Model Metrics: ROC-AUC, Precision/Recall', 'Cross-Validation Strategies'],
        projects: [
          {
            name: 'Predictive Medical Diagnostic Risk Engine',
            description: 'End-to-end predictive model forecasting patient readmission rates with calibration curves and SHAP feature importance.'
          }
        ],
        resources: [
          { name: 'StatQuest with Josh Starmer', type: 'Video', url: 'https://statquest.org/' },
          { name: 'Scikit-Learn Machine Learning Guide', type: 'Docs', url: 'https://scikit-learn.org/' }
        ]
      },
      {
        phaseNumber: 3,
        title: 'Model Deployment, Dashboards & Storytelling',
        duration: 'Weeks 8-10',
        description: 'Packaging models with Streamlit/FastAPI, cloud dashboard hosting, and executive business communication.',
        topics: ['Streamlit Interactive Data Applications', 'FastAPI Prediction Endpoints', 'Data Storytelling & Visualization Principles', 'Automated Batch Scoring Pipelines'],
        projects: [
          {
            name: 'Live Real Estate Valuation Web Application',
            description: 'Interactive geospatial valuation map powered by an XGBoost model and hosted on Streamlit Cloud.'
          }
        ],
        resources: [
          { name: 'Streamlit Official Tutorial', type: 'Docs', url: 'https://docs.streamlit.io/' },
          { name: 'Storytelling with Data (Cole Nussbaumer Knaflic)', type: 'Book', url: 'https://www.storytellingwithdata.com/' }
        ]
      }
    ]
  }
];
