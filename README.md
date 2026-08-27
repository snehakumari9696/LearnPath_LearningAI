#  LearnPath AI — Personalized AI Learning Path Generator

![Build Status](https://img.shields.io/badge/status-active-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)

**LearnPath AI** is an intelligent, automated learning roadmap generator designed to help students, developers, and professionals structure their learning journey for any target skill or technology stack.

By leveraging advanced machine learning algorithms alongside flexible execution modes, LearnPath AI eliminates the guesswork from self-learning, offering structured step-by-step milestones, curated resources, and duration estimates.

---

##  Features

- ** AI-Powered Roadmap Generation:** Dynamically builds customized, step-by-step learning roadmaps tailored to user goals.
- ** Smart Dual Mode Execution:**
  - **AI Mode:** Connects live to the backend service for personalized real-time path creation.
  - **Demo Mode:** Uses rich mock data to provide instant testing without requiring external credentials.
- **Integrated Learning Resources:** Each roadmap milestone includes recommended topics, expected completion timelines, and actionable tasks.
- ** Multi-Skill Support:** Input single or multiple target technologies (e.g., *Python, Data Science, Machine Learning*) to generate cross-disciplinary learning paths.
- ** Responsive & Interactive UI:** Modern, lightweight frontend designed for seamless mobile and desktop experiences.

---

##  Tech Stack

- **Frontend:** HTML5, CSS3, JavaScript (ES6+)
- **Backend:** Node.js, Express.js
- **API Engine:** RESTful API Architecture
- **Deployment & Hosting:** Vercel / Render

---

## System Architecture

LearnPath AI utilizes a decoupled client-server architecture designed for fast request-response cycles, robust error handling, and flexible backend integrations.

* **Presentation Layer (Frontend):** Implemented using HTML5, CSS3, and standard JavaScript. It provides an intuitive form interface for user inputs, manages local execution states (AI Mode vs. Demo Mode), and dynamically injects generated roadmaps into the Document Object Model (DOM).
* **Application Layer (Backend):** Powered by Node.js and the Express framework. The application handles API routing, parses incoming client payloads, sets HTTP response headers, and manages CORS configurations for local and deployed access.
* **Logic & Integration Engine:** 
  * **Live Engine:** Constructs custom contextual prompts, passes requirements to external machine learning endpoints, and formats the output into clean JSON structures.
  * **Fallback Engine:** Operates a local dataset controller that returns pre-structured mock roadmap payloads instantly when live credentials are absent or restricted.

---

## Project Workflow

1. **User Request Initialization:** The user inputs target technologies or career paths into the frontend control panel and selects an execution mode.
2. **Client Processing:** The client JavaScript validates the input fields, displays a loading state on the interface, and dispatches an asynchronous HTTP POST payload to the backend service.
3. **Route Handling & Validation:** The Express backend receives the payload at the designated API route and verifies the presence of target parameters.
4. **Data Generation & Payload Construction:**
   * If **AI Mode** is requested, the server formats an optimized system prompt, queries the engine endpoint, and catches/sanitizes any generation errors.
   * If **Demo Mode** is selected, the server bypasses external network calls and directly fetches pre-formatted milestone objects.
5. **Response Delivery:** The backend sends a standardized JSON object back to the client containing milestone names, descriptions, estimated duration, and recommended learning resources.
6. **DOM Rendering:** The client parses the JSON response, removes the loading indicator, and populates the dashboard screen with interactive roadmap nodes.
---

##  Getting Started

Follow these steps to run the project locally on your machine.

### Prerequisites

- [Node.js](https://nodejs.org/) (v16.0 or higher)
- [npm](https://www.npmjs.com/) (installed automatically with Node)

---

## [https://github.com/snehakumari9696/LearnPath_AI.git](https://github.com/snehakumari9696/LearnPath_AI.git)
   cd LearnPath_AI
