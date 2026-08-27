# 🎓 LearnPath AI – Personalized Roadmap & Learning Generator

> **Empowering learners with dynamic, structured, AI-generated study paths built around your exact goals.**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Built with Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Powered by Gemini AI](https://img.shields.io/badge/AI-Google%20Gemini-blue.svg)](https://deepmind.google/technologies/gemini/)

---

##  Problem Statement

Traditional online learning often leaves students overwhelmed with fragmented tutorials, unclear progression, and zero personalization. Static roadmaps don't account for a user's current skill level, time constraints, or specific project goals.

##  Solution

**LearnPath AI** bridges this gap by acting as a real-time AI learning architect. Input any target skill or domain, and LearnPath AI instantly analyzes the core dependencies to construct a structured, step-by-step roadmap complete with estimated timeframes, curating high-value resources and milestones.

---

##  Key Features

- ** Dual Mode Execution:**
  - **AI Mode:** Connects to the **Google Gemini API** for real-time, dynamic curriculum generation.
  - **Demo Mode:** Uses built-in mock engine fallback so judges/testers can evaluate UI/UX without entering an API key.
- ** Dynamic Roadmap Generation:** Generates granular, phased learning paths customized to multiple input topics.
- ** Curated Resources & Timeline:** Breaks down study goals into realistic time estimates and direct learning materials.
- ** Responsive Interface:** High-performance, mobile-first Web UI built for seamless interaction.
- ** Instant Cloud Deployment:** Pre-configured for zero-friction setup on Vercel or Node.js environments.

---

## System Architecture

```mermaid
```mermaid
graph TD
    A[User Inputs Target Topic / Skill] --> B{API Key Provided?}
    B -- Yes --> C[Gemini AI Orchestrator]
    B -- No / Fallback --> D[Mock Learning Engine]
    C --> E[Structured Roadmap Parser]
    D --> E
    E --> F[Render Interactive UI Roadmap]
    F --> G[Resource Mapping & Timeline]

User Workflow Flowchart
flowchart LR
    Start([User Starts App]) --> Input[Enter Skill / Goal]
    Input --> SelectMode[Select Mode]
    SelectMode -->|Gemini Key Available| AIMode[Execute Gemini API Prompt]
    SelectMode -->|No Key| DemoMode[Load Offline Demo Pathway]
    AIMode --> Process[Parse JSON Response]
    DemoMode --> Process
    Process --> Display[Display Step-by-step Roadmap]
    Display --> End([Learner Starts Course])

Component,Technology Used
Frontend,"HTML5, CSS3, JavaScript (ES6+)"
Backend,"Node.js, Express.js"
AI Engine,Google Gemini API
Diagramming,Mermaid.js
Deployment,Vercel

Quick Start
1️. Prerequisites
Ensure you have Node.js 18+ installed on your machine.

2️. Clone & Install
git clone [https://github.com/snehakumari9696/LearnPath_LearningAI.git](https://github.com/snehakumari9696/LearnPath_LearningAI.git)
cd LearnPath_LearningAI
npm install

3. Environment Setup
Create a .env file in the root directory:
PORT=3000
GEMINI_API_KEY=your_google_gemini_api_key_here

4️. Run Application
Bash
# Run in development mode
npm run dev

# Or run standard node server
npm start
Open your browser and navigate to http://localhost:3000.

Deployment
Deploying to Vercel
Import repository snehakumari9696/LearnPath_LearningAI into Vercel.

Under Environment Variables, add:

GEMINI_API_KEY : <Your-Gemini-API-Key>

Click Deploy.

##  License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

    F --> G[Resource Mapping & Timeline]

