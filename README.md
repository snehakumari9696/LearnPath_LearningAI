LearnPath AI — Autonomous & Dynamic Learning Path Generator
An AI-driven personalized roadmap, scheduling, and learning analytics platform designed to solve information overload by converting broad learning goals into structured, adaptive micro-curriculums.

Table of Contents
​Executive Overview
​Core Problem & Solution
​Key Features
​Detailed System Architecture
​End-to-End Project Workflow
​Comprehensive Tech Stack
​Database & Data Models
​Project Directory Structure
​Local Setup & Installation
​API Reference
​Future Roadmap
​License & Acknowledgments

Executive Overview
​LearnPath AI is an intelligent educational platform that constructs personalized, day-by-day learning trajectories for users mastering complex subjects. Traditional learning approaches often fail due to unstructured content, vague pacing, and poor progress evaluation.
​LearnPath AI solves this by taking user preferences (e.g., target domain, available daily hours, prior experience, preferred learning style) and feeding them through an AI orchestration system. The system queries LLMs to output dynamic schedules, curated public resource recommendations, and interactive daily milestones.

​ Core Problem & Solution
​The Problem: Self-directed learners spend up to 40% of their time searching for resources, determining what to learn next, and estimating schedules rather than acquiring skills.
​The Solution: LearnPath AI acts as an autonomous tutor that ingests target objectives, automatically formats structured JSON roadmaps, provides verified learning links, and continuously tracks learner execution metrics.

​ Key Features
​ Dynamic Goal Parsing: Converts raw goal prompts (e.g., "Learn PyTorch for Deep Learning in 3 weeks with 1 hour/day") into micro-topics.
​ Algorithmic Schedule Generation: Calculates exact topic distribution based on user velocity, constraints, and total days.
​ Enriched Prompt Engineering: Injects system context, guardrails, and structural constraints to guarantee reliable output formats.
​ Context Retrieval & Fallback: Integrates vector database support to query cached reference curricula and prevent hallucination.
​ Adaptive Pacing & Progress Engine: Recalculates remaining milestones dynamically if a user misses scheduled days or progresses ahead of schedule.
​ Developer-Ready APIs: Modular application code separating AI prompt construction, data persistence, and UI presentation.

​ Detailed System Architecture
​The following block diagram maps out the data flow across the presentation, backend, intelligence, and storage tiers.
========================================================================================
                          TIER 1: USER INTERFACE (PRESENTATION LAYER)
========================================================================================
[ Web Interface / Client Workspace ] ---> [ Form Inputs: Goal, Skill Level, Hours/Day ]
                                                      |
                                                      v
========================================================================================
                     TIER 2: APPLICATION BACKEND (ROUTING & MIDDLEWARE)
========================================================================================
                                     [ API Gateway / Router ]
                                              |
        +-------------------------------------+-----------------------------------+
        |                                     |                                   |
        v                                     v                                   v
[ Auth & Session Handler ]         [ Prompt Engineering Engine ]       [ Pacing & Scheduler Core ]
                                              |                                   |
                                              v                                   |
========================================================================================  |
                      TIER 3: INTELLIGENCE & LLM ORCHESTRATION LAYER              |
========================================================================================  |
                     [ Generative LLM Core: Google Gemini / OpenAI ]              |
                                              ^                                   |
                                              |                                   |
                                     [ RAG Vector Indexer ]                       |
                                              |                                   |
========================================================================================  |
                            TIER 4: DATA & PERSISTENCE LAYER                      |
========================================================================================  |
[ Vector DB (ChromaDB/FAISS) ] <--------------+----------------------------------+   |
                                              |                                  |   |
                                              v                                  v   v
                             [( Database: User Profiles, Schedules, Progress Metrics )]

Architectural Subsystem Breakdown
Subsystem Primary Responsibilities Technical Components
Presentation Tier User onboarding, interactive roadmap viewing, milestone completion logging. Streamlit / HTML5 / CSS3 / JavaScript
Application Tier Request routing, system prompt formatting, state management, output validation. Python 3.10+, FastAPI / Flask, Pydantic
Intelligence Tier Dynamic prompt evaluation, structured content generation, context embedding. Google Gemini API, LangChain / LlamaIndex
Data Tier Storing user session data, progress analytics, vector index for domain resources. SQLite / PostgreSQL, FAISS / ChromaDB

End-To-End Project Workflow
[ START: User Accesses Platform ]
              │
              ▼
[ Input Goal, Level & Daily Hours ] ──► [ Validate Inputs & Calculate Constraint Matrix ]
                                                        │
                                                        ▼
                                       [ Context Retrieval Required? ]
                                            ├── YES ──► [ Query Vector DB for Syllabi ]
                                            │                     │
                                            └── NO ───────────────┤
                                                                  │
                                                                  ▼
[ Store Session & Analytics ] ◄── [ Parse Output JSON ] ◄── [ Execute LLM Prompt Query ]
              │
              ▼
[ Render Interactive Roadmap ] ──► [ User Executes & Marks Daily Tasks ]
                                                        │
                                                        ▼
                                            [ All Tasks Complete? ]
                                                ├── NO ──► [ Recalculate Pacing ]
                                                │                     │
                                                └── YES ──────────────┤
                                                                      │
                                                                      ▼
                                                       [ END: Goal Achieved!  ]

Comprehensive Tech Stack
​Frontend: Streamlit / Web Client UI (Interactive dashboards, milestone views, dynamic input forms)
​Backend Framework: Python 3.10+ (Core orchestration, REST endpoints, logic handlers)
​AI Engine & Models: Google Gemini API (google-generativeai), OpenAI API integration modules
​Context & Retrieval (RAG): ChromaDB / FAISS for storing specialized topic documentation
​Data Persistence: SQLite (Development) / PostgreSQL (Production ready)
​Validation & Utilities: Pydantic (Schema enforcement), python-dotenv (Config management)

DataBase & Data Models
User Progress Model Schema
+-------------------+        +-----------------------+        +-------------------------+
|     USERS         |        |    LEARNING_PATHS     |        |    DAILY_MILESTONES     |
+-------------------+        +-----------------------+        +-------------------------+
| user_id (PK)      | <----> | path_id (PK)          | <----> | milestone_id (PK)       |
| email             |        | user_id (FK)          |        | path_id (FK)            |
| created_at        |        | target_skill          |        | day_number              |
| skill_level       |        | total_days            |        | topic_title             |
+-------------------+        | progress_percentage   |        | resource_link           |
                             | created_at            |        | is_completed (Boolean)  |
                             +-----------------------+        +-------------------------+

Project Directory Structure
LearnPath_LearningAI/
│
├── config/
│   ├── __init__.py
│   ├── settings.py            # Global application settings & configuration
│   └── prompt_templates.py    # Structured LLM prompt definitions
│
├── src/
│   ├── __init__.py
│   ├── ai/
│   │   ├── __init__.py
│   │   ├── llm_client.py       # Wrapper for Gemini API & LLM calls
│   │   └── RAG_engine.py      # Vector Store & retrieval management
│   │
│   ├── database/
│   │   ├── __init__.py
│   │   ├── models.py          # Database schema definitions
│   │   └── operations.py      # CRUD database operations
│   │
│   ├── scheduler/
│   │   ├── __init__.py
│   │   └── pacing.py          # Schedule distribution algorithm
│   │
│   └── utils/
│       ├── __init__.py
│       └── validators.py      # Schema and JSON validation tools
│
├── assets/                    # Project documentation assets
├── app.py                     # Main application entry point
├── requirements.txt           # Project python dependencies
├── .env.example               # Template for environment configuration
├── .gitignore                 # Files excluded from source control
└── README.md                  # Project Readme documentation

Local Setup & Installation

### Prerequisites
- **Node.js** (v18.0.0 or higher) and **npm** installed on your machine.
- A valid **Google Gemini API Key** (Obtain one from [Google AI Studio](https://aistudio.google.com/)).

### Step-by-Step Installation

1. **Clone the repository**
   ```bash
   git clone [https://github.com/snehakumari9696/LearnPath_LearningAI.git](https://github.com/snehakumari9696/LearnPath_LearningAI.git)
   cd LearnPath_LearningAI
2.Install project dependencies
   npm install
3.Create Environment Variables
   GEMINI_API_KEY=your_actual_gemini_api_key_here
   PORT=3000
4.Launch te Development Server
   npm run dev

 License & Acknowledgments
This project is open-source and available under the MIT License.
Developed by Sneha Kumari,Rishabh Verma, Zafar Khan and Yash Singh for HCL Amplified.
