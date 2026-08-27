# 🎓 LearnPath AI — Personalized AI Learning Path & Roadmap Generator

> **Empowering learners with dynamic, structured, and intelligent learning paths powered by Generative AI.**

---

##  Table of Contents
- [About The Project](#-about-the-project)
- [Key Features](#-key-features)
- [System Architecture](#-system-architecture)
- [Project Workflow](#-project-workflow)
- [Tech Stack](#-tech-stack)
- [Project Directory Structure](#-project-directory-structure)
- [Getting Started](#-getting-started)
- [Future Roadmap](#-future-roadmap)
- [Contributing](#-contributing)
- [License](#-license)

---

##  About The Project

**LearnPath AI** is an intelligent web platform engineered to solve the problem of information overload. Learning a new skill, tech stack, or academic subject can be daunting due to fragmented resources and a lack of clear direction. 

LearnPath AI leverages **Large Language Models (LLMs)** to generate custom, day-by-day learning schedules, curated resources, and interactive progress tracking based on a user's current knowledge level, target skill, and available learning hours.

---

##  Key Features

-  **Tailored Roadmap Generation**: Custom-fit roadmaps tailored to beginner, intermediate, or advanced levels.
-  **Dynamic Pace Scheduler**: Automatically splits large concepts into manageable daily or weekly milestones.
-  **Curated Resources**: Recommends top YouTube tutorials, documentation, and hands-on project ideas.
-  **Real-time AI Processing**: Uses prompt orchestration for fast, context-aware output.
-  **Progress & Analytics Dashboard**: Track completed modules and monitor learning metrics.

---

##  System Architecture

The following diagram illustrates the high-level system architecture of LearnPath AI, showing the data flow between the User Interface, Backend API Router, AI Integration layer, and Storage layer.

```mermaid
graph TB
    %% Front End / Client Layer
    subgraph Client Tier [" Frontend / UI Tier"]
        UI[User Interface / Web Dashboard]
        Inputs[User Input: Skill Target, Pacing, Goal Level]
        UI --> Inputs
    end

    %% Application / Backend Tier
    subgraph App Tier [" Application & Logic Tier"]
        API[API Gateway / Flask or FastAPI Router]
        Auth[User Authentication & Session Management]
        PromptEng[Prompt Engineering & Formatting Engine]
        Scheduler[Schedule Logic & Progress Tracker Engine]

        API --> Auth
        API --> PromptEng
        API --> Scheduler
    end

    %% AI / Intelligence Tier
    subgraph AI Tier [" AI & Intelligence Layer"]
        LLM[LLM Orchestration: Google Gemini API / OpenAI API]
        RAG[RAG / Knowledge Base Retrieval Engine]
        RecEngine[Resource Recommendation Engine]

        LLM <--> RAG
        LLM --> RecEngine
    end

    %% Persistence Layer
    subgraph Data Tier [" Data Persistence Layer"]
        DB[(User Database: Auth, Schedules, Analytics)]
        VectorDB[(Vector Store: Resource Embeddings & Docs)]
    end

    %% Inter-layer Connections
    Inputs -->|HTTPS / REST Request| API
    PromptEng -->|Formatted Context & Prompt| LLM
    LLM -->|Structured JSON Response| Scheduler
    RAG <--> VectorDB
    Scheduler <--> DB
    Auth <--> DB
    Scheduler -->|JSON Response / Schedule Data| UI

Project Workflow
This end-to-end flowchart outlines the execution path—from initial user input to AI generation, output validation, and continuous user evaluation.

flowchart TD
    %% Phase 1: User Onboarding
    Start([ Start: User Accesses LearnPath AI]) --> Step1[Enter Skill / Target Subject]
    Step1 --> Step2[Select Skill Level & Available Hours/Day]

    %% Phase 2: Input Processing & Validation
    Step2 --> Step3[Backend Pre-processes Input & Formats Context Prompt]
    Step3 --> Step4{Vector Search Context Required?}
    Step4 -- Yes --> Step5[Query Vector DB / Retrieve Supplemental Docs]
    Step4 -- No --> Step6[Pass Formatted Prompt to Gemini LLM]
    Step5 --> Step6

    %% Phase 3: AI Roadmap Generation
    Step6 --> Step7[LLM Generates Structured JSON Learning Path]
    Step7 --> Step8{Validation Check: Is Output Valid JSON?}
    
    %% Error handling / Retry loop
    Step8 -- No (Parsing Error) --> Step9[Trigger Error Fallback / Reprompt Engine]
    Step9 --> Step6
    
    %% Phase 4: Delivery & Learning Loop
    Step8 -- Yes --> Step10[Parse Milestones & Schedule to Dashboard]
    Step10 --> Step11[User Views Learning Path & Accesses Resources]
    Step11 --> Step12[User Completes Daily Tasks & Quizzes]
    
    Step12 --> Step13{Goal Completed?}
    Step13 -- No --> Step14[Update Progress Metrics & Adapt Pace]
    Step14 --> Step11
    Step13 -- Yes --> End([ Milestone Reached / Certificate Generated])
Tech Stack
​Frontend
​Framework: HTML5, CSS3, JavaScript / Streamlit / React.js
​Styling: Tailwind CSS / Custom CSS
​Backend & Core Logic
​Language: Python 3.10+
​API Framework: Flask / FastAPI / Node.js
​Environment Management: python-dotenv
​AI & Machine Learning
​LLM Engine: Google Gemini API (google-generativeai) / OpenAI GPT API
​Prompt Engineering: Dynamic JSON Structure Enforcement
​Vector Search (Optional): FAISS / ChromaDB (for contextual document retrieval)
​Deployment & Tooling
​Version Control: Git & GitHub
​Deployment: Vercel / Streamlit Community Cloud / Render
​Diagrams: Mermaid.js

Project Directory Structure
LearnPath_LearningAI/
│
├── assets/                  # Architecture diagrams, screenshots, logos
│   └── logo.png
├── config/                  # Configuration files and prompt templates
│   └── prompts.py
├── src/                     # Core application source code
│   ├── components/          # Frontend component scripts / templates
│   ├── services/            # API callers and Gemini LLM integrations
│   │   ├── ai_service.py
│   │   └── database.py
│   └── utils/               # Helper utility functions
├── app.py                   # Application Entry Point
├── .env.example             # Template for local environment variables
├── .gitignore               # Files ignored by git tracking
├── requirements.txt         # Python project dependencies
└── README.md                # Project documentation

Getting Started
Follow these steps to set up and run LearnPath AI locally.
1. Prerequisites
Python 3.9+ or Node.js installed on your machine.
A Google Gemini API Key (Get one from Google AI Studio).
2️. Clone the Repository
git clone [https://github.com/snehakumari9696/LearnPath_LearningAI.git](https://github.com/snehakumari9696/LearnPath_LearningAI.git)
cd LearnPath_LearningAI
3. Set Up Virtual Environment(Python)
# On Windows
python -m venv venv
venv\Scripts\activate

# On macOS/Linux
python3 -m venv venv
source venv/bin/activate
4.Install Dependencies
pip install -r requirements.txt

License
​Distributed under the MIT License. See LICENSE for more information.
​<p align="center">
Made by <a href="https://github.com/snehakumari9696">Sneha Kumari</a>
</p>
---

### Key Highlights of this README:
1. **GitHub Native Mermaid Rendering**: GitHub automatically parses ` ```mermaid ` blocks into interactive visual flowcharts.
2. **Clear Architecture**: Highlights the front-end, backend router, prompt engineering, Gemini integration, and database structure.
3. **Structured Workflow**: Covers prompt generation, output parsing validation, error fallback loops, and progress tracking.

