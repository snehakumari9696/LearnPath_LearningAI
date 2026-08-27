# 🧭 LearnPath AI

### Your Goal. Your Skills. Your Dynamic Learning Journey.

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-4.x-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=flat-square&logo=javascript&logoColor=black)](https://developer.mozilla.org)
[![Gemini AI](https://img.shields.io/badge/Gemini_AI-Google-4285F4?style=flat-square&logo=google-gemini&logoColor=white)](https://deepmind.google/technologies/gemini/)
[![Tests](https://img.shields.io/badge/Tests-passing-brightgreen?style=flat-square)](#testing)
[![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](LICENSE)

> **LearnPath AI** is an AI-powered dynamic learning operating system that transforms a learner's goal into an executable, personalized, measurable journey. Powered by Google Gemini AI with built-in offline demo fallbacks, it turns scattered topics into structured, phased learning steps.

---

## ✨ Features Highlights

| Feature | Technology |
|---------|-----------|
| **Dual Mode AI** | Gemini API Engine + Local Mock Engine fallback |
| **Dynamic Roadmaps** | AI-generated learning paths customized to any goal |
| **Prerequisite Ordering** | Phase-by-phase dependent learning modules |
| **Resource Mapping** | Curated materials with targeted completion estimates |
| **Responsive Web UI** | High-performance dashboard built with HTML5, CSS3 & ES6 JS |
| **Zero Setup Run** | Works out-of-the-box offline or with a custom Gemini key |

---

## How It Works — System Flow

```mermaid
flowchart TD
    subgraph Input["🎯 Learner Input"]
        A[Type a goal<br/>or pick a target topic]
    end

    subgraph Intelligence["🧠 AI Layer"]
        B{Gemini API Key?}
        C[Google Gemini AI Engine<br/>dynamic curriculum generation]
        D[Offline Demo Engine<br/>built-in fallback pathway]
    end

    subgraph Roadmap["🗺️ Personalized Roadmap"]
        E[Structural JSON Parser<br/>prerequisites → phases → weeks]
        F[Resource & Time Estimator]
    end

    subgraph Learning["📚 Output Engine"]
        G[Step-by-Step UI Roadmap]
        H[Curated Materials & Milestones]
    end

    A --> B


---

## Key Features

### 🎯 Dynamic Roadmap Generation
Transforms broad or niche target goals into phased, weekly milestones with dependent prerequisite ordering.

### 🧠 Dual Engine Architecture
Connects live to **Google Gemini API** for personalized AI curriculums, with an automatic fallback to an **Offline Demo Engine** if no key is provided.

### 📚 Resource & Time Estimations
Breaks down study goals into realistic completion timelines and maps targeted learning materials for each phase.

### 📱 Responsive Web Interface
Clean, mobile-first Web UI designed for fast loading, scannable reading, and interactive path tracking.

---

## Architecture

```mermaid
flowchart TB
    subgraph Frontend["🖥️ Client Layer"]
        UI["Web Dashboard<br/>HTML5 · CSS3 · ES6 JS"]
        Input["Goal Intake Form"]
    end

    subgraph Backend["⚡ Application Server"]
        Express["Express.js Server<br/>Port 3001"]
        Controller["Roadmap Controller & Router"]
    end

    subgraph AI["🤖 Engine Layer"]
        Gemini["Google Gemini AI Service"]
        Mock["Offline Demo Engine"]
        Parser["JSON Structuring Utility"]
    end

    Input --> UI -->|HTTP POST| Express
    Express --> Controller
    Controller --> Gemini & Mock
    Gemini & Mock --> Parser --> UI

Tech Stack:
| Layer | Technology |
|---|---|
| **Backend** | Node.js (v18+) · Express.js |
| **Frontend** | HTML5 · CSS3 · ES6 JavaScript |
| **AI/ML** | Google Gemini API (`@google/generative-ai`) |
| **Diagramming** | Mermaid.js |
| **Deployment** | Vercel / Render |

Installation:
# Clone the repository
git clone https://github.com/snehakumari9696/LearnPath_LearningAI.git
cd LearnPath_LearningAI

# Install Node.js dependencies
npm install

Project Structure:
LearnPath_LearningAI/
├── public/                 # Web interface assets
│   ├── index.html          # Dashboard HTML
│   ├── css/                # Custom styling
│   └── js/                 # Client logic & renderers
├── src/
│   ├── routes/             # Express API endpoints
│   ├── services/           # Gemini AI & mock fallback logic
│   └── utils/              # Parsers & helpers
├── .env.example            # Environment template
├── server.js               # Express server entry point
├── package.json            # Node project configuration
└── README.md               # Project documentation

License:
MIT License

Copyright (c) 2026 Sneha Kumari

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
    B -- "Yes" --> C --> E
    B -- "No / Fallback" --> D --> E
    E --> F --> G --> H
