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
The LearnPath AI platform is engineered using a decoupled, four-tier web architecture. The backend service acts as a central coordinator, managing data flow between the user interface, external Large Language Models (LLMs), contextual data stores, and local session databases.
Tier 1: User Interface & Presentation Layer
The front-end client serves as the user's primary interface. It is responsible for gathering learning parameters and rendering real-time progress updates.
User Input Module: Captures target skills, starting experience level (Beginner, Intermediate, Advanced), available daily learning hours, and preferred learning styles.
Interactive Dashboard: Displays generated learning roadmaps, day-by-day milestone checklists, resource recommendations, and overall skill completion metrics.
State Management: Maintains local user states to seamlessly sync completion status changes back to the server.
Tier 2: Application Server & Processing Layer
The backend server handles application routing, business logic execution, request processing, and data transformation.
API Gateway & Routing: Exposes modular RESTful endpoints to process client requests, deliver generated path payloads, and update milestone logs.
Prompt Engineering Engine: Ingests user input and injects it into customized system templates designed to enforce strict structural constraints and safety guardrails.
JSON Schema Validation Core: Intercepts generated outputs from the AI layer to verify structural integrity, ensuring data can be reliably parsed by the front-end dashboard.
Pacing & Schedule Controller: Dynamically recalculates upcoming milestone dates based on real-time completion logs and user learning velocity.
Tier 3: Intelligence & AI Orchestration Layer
The intelligence layer handles dynamic path generation, contextual resource retrieval, and curriculum formatting.
Google Gemini LLM Engine: Processes contextually enriched system prompts to generate structured day-by-day modules, key objectives, and practical project ideas.
RAG Retrieval Engine: Interfaces with vector database stores to retrieve reference material, documented syllabi, and curated learning links to reduce model hallucination.
Tier 4: Data & Persistence Layer
The storage layer handles persistent records for user profiles, generated learning paths, and indexed domain knowledge.
Relational Database: Manages user credentials, active roadmaps, individual module completion flags, and historical analytics.
Vector Store: Keeps vectorized index embeddings of reference domain documentation, topic breakdowns, and recommended public resources.
Architectural Subsystem Breakdown
Subsystem Primary Responsibilities Technical Components
Presentation Tier User onboarding, interactive roadmap viewing, milestone completion logging. Streamlit / HTML5 / CSS3 / JavaScript
Application Tier Request routing, system prompt formatting, state management, output validation. Python 3.10+, FastAPI / Flask, Pydantic
Intelligence Tier Dynamic prompt evaluation, structured content generation, context embedding. Google Gemini API, LangChain / LlamaIndex
Data Tier Storing user session data, progress analytics, vector index for domain resources. SQLite / PostgreSQL, FAISS / ChromaDB

End-To-End Project Workflow
Phase 1: Parameter Intake
​The user inputs their target skill (e.g., "Data Science"), current experience level, total duration, and daily time commitment. The system validates these parameters on the client side before sending them to the backend server.
​Phase 2: Context Enrichment & Prompt Assembly
​The backend packages the input parameters and checks if domain-specific context is needed. If required, it queries a vector database to retrieve reference syllabi and verified resource links. It then merges the user inputs, context, and structural formatting guardrails into a standardized system prompt.
​Phase 3: AI Generation & Schema Validation
​The system dispatches the prompt to the Google Gemini API, which generates a day-by-day learning schedule. The backend intercepts the raw output and runs a schema check to verify JSON structural integrity. If malformed, an automatic reprompting routine fixes the output before displaying it.
​Phase 4: Delivery & Workspace Render
​Once validated, the system saves the roadmap and individual milestones to the database. It then parses the payload to render an interactive dashboard with daily task checklists and progress trackers.
​Phase 5: Tracking & Adaptive Pacing Loop
​As the user completes daily tasks, the system logs progress metrics in real time. If the user misses deadlines or moves faster than planned, the pacing controller dynamically redistributes the remaining milestones across future days until the goal is achieved.
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
