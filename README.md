# SmartIQ: Dual IQ & EQ Psychometric Platform

SmartIQ is an enterprise-ready, lightweight, cross-platform web application built to measure Cognitive Intelligence (IQ) and Emotional Intelligence (EQ) independently. The system computes raw scores locally, renders real-time performance analytics, and leverages free LLM API instances (**Google Gemini / Groq**) to generate hyper-personalized psychological archetypes and custom daily mental improvement habits.

---

## 🚀 Core Value & Features

- **Universal Cross-Device Access:** Optimized with mobile-first fluid design layouts (Tailwind CSS breakpoints) running smoothly on iOS, Android, macOS, and Windows across Chrome, Safari, Edge, Brave, and Firefox.
- **Dynamic Anti-Boredom Question Banks:** SmartIQ extracts questions randomly from a comprehensive local pool (e.g., 5 out of 15 questions per category), ensuring over 27,000 unique quiz variations to completely prevent practice/memorization effects on test retakes.
- **Cheating Deterrent Systems:** Features focused browser tab tracking and individual client-side question countdown timers to eliminate quick web searches for answers.
- **Frictionless Anonymous Profiles:** Users can instantly take tests anonymously using unique browser-level `localStorage` session UUIDs, with an optional account registration portal (Supabase/Firebase OAuth) to track long-term history.
- **Visual Performance Mapping:** Renders immediate visual breakdowns (Radar/Bar charts) of cognitive dimensions (Logic, Math, Spatial) and emotional competencies (Self-Awareness, Self-Regulation, Empathy).
- **Interactive AI Coaching Module:** Once both assessments are completed, a secure backend call passes the metrics to a free-tier LLM API to assemble a personalized Mind Profile Archetype and offer interactive "Explain My Mistake" context for incorrect answers.
- **Granular Admin Control Console:** A password-protected panel equipped with complete CRUD forms to modify the question pool live from the web, view user traffic streams, track performance bell curves, and tune the AI system prompt on the fly.

---

## 🛠️ Architecture & Free-Tier Tech Stack

The architecture splits responsibilities cleanly between client-side rendering and secure server-side AI execution with **\$0 operational costs**:

- **Frontend (Hosted on Vercel):** React.js (via Vite) + Tailwind CSS + Chart.js / Recharts.
- **Backend (Hosted on Render):** Python 3.11 + FastAPI + Uvicorn ASGI server running inside an isolated virtual environment (`venv`).
- **Database & Auth Layer:** Supabase or Firebase (Free Tier SDK).
- **AI Inference Engine:** Google AI Studio (`gemini-2.5-flash`) or Groq Cloud (`llama3-8b`).

```text
                  ┌─────────────────────────────────────────┐
                  │          ANY BROWSER & DEVICE           │
                  │   [Mobile Phone 📱 | Tablet 📟 | PC 💻]  │
                  └────────────────────┬────────────────────┘
                                       │
                                       ▼
┌────────────────────────────────────────────────────────────────────────────┐
│                    FRONTEND ENGINE: Vercel (Free Tier)                     │
│  • Framework: React.js (via Vite setup)                                   │
│  • Local Logic: Array-shuffling question selectors, countdown quiz timers  │
│  • Data Charts: Chart.js / Recharts (Lightweight SVG canvas renderings)   │
└───────────────────────────────────────┬────────────────────────────────────┘
                                        │ Secure JSON Payload (Scores Only)
                                        ▼
┌────────────────────────────────────────────────────────────────────────────┐
│                    BACKEND ENGINE: Render (Free Tier)                      │
│  • Language & Framework: Python 3.11 + FastAPI (Inside 'venv')             │
│  • Server Security: Explicit CORS middleware restricting access to Vercel  │
│  • Gateway Duty: Houses the hidden free AI API Secret Keys and Core Prompts│
└───────────────────────────────────────┬────────────────────────────────────┘
                                        │ Authenticated API Routing Request
                                        ▼
┌────────────────────────────────────────────────────────────────────────────┐
│               AI INFERENCE ENGINE: Google AI Studio / Groq                 │
│  • Core LLMs: gemini-2.5-flash or llama3-8b (Free Tier Endpoint Keys)     │
│  • Role: Parses JSON score inputs and answers with structured JSON text    │
└────────────────────────────────────────────────────────────────────────────┘
```

---

## 📂 Project Repository Structure

```text
SmartIQ/                  # Root Project Directory
│
├── .gitignore            # Tells Git to exclude node_modules, keys, and python venv
├── README.md             # Complete project overview documentation
│
├── frontend/             # React Application Workspace (Deploys to Vercel)
│   ├── src/
│   │   ├── components/   # Shared UI elements (Navbar.jsx, Timer.jsx, PerformanceChart.jsx)
│   │   ├── pages/        # Route pages (Home.jsx, IQQuiz.jsx, EQQuiz.jsx, Results.jsx, Admin.jsx)
│   │   ├── App.jsx       # Component router management
│   │   └── main.jsx      # Vite application mount point
│   ├── package.json      # Frontend package dependencies
│   └── vite.config.js    # Vite bundling settings
│
└── backend/              # Python Application Workspace (Deploys to Render)
    ├── venv/             # Isolated Python virtual environment containing dependencies
    ├── main.py           # FastAPI entry point, CORS configuration, & AI prompt logic
    ├── requirements.txt  # Python packages (fastapi, uvicorn, google-genai, groq)
    └── runtime.txt       # Pinpoints server build environment (python-3.11.0)
```

---

## ⚙️ Local Development Installation

### 1. Prerequisites

Ensure you have the following installed on your machine:

- [Node.js](https://nodejs.org) (v18 or higher)
- [Python](https://python.org) (v3.11.x)
- [VS Code](https://visualstudio.com)

### 2. Setting Up the Python Backend inside `venv`

Open a terminal workspace window inside VS Code and execute the following commands to isolate and install your environment dependencies:

```bash
cd backend
# Create the isolated virtual environment
python -m venv venv

# Activate the virtual environment
# On Windows (Command Prompt):
venv\Scripts\activate
# On Windows (PowerShell):
.\venv\Scripts\Activate.ps1
# On macOS/Linux:
source venv/bin/activate

# Install the server dependencies inside the active venv
pip install --upgrade pip
pip install -r requirements.txt
```

Create a temporary local environment file named `.env` inside the `backend/` folder to hold your local secrets:

```text
GEMINI_API_KEY=your_free_google_ai_studio_key_here
# OR GROQ_API_KEY=your_free_groq_api_key_here
PORT=8000
```

Run the local development server from within your active virtual environment:

```bash
python main.py
```

The backend server will spin up locally at `http://localhost:8000`.

### 3. Setting Up the React Frontend

Open a separate, clean terminal window in VS Code and execute:

```bash
cd frontend
# Install package dependencies
npm install

# Run the frontend dev environment
npm run dev
```

The SmartIQ React UI will spin up locally at `http://localhost:5173`.

---

## 🚀 Live Cloud Deployment Workflow

### Backend (Render Deployment)

1. Commit all project configurations and push your repository to your **GitHub** profile.
2. Log into the [Render Console](https://render.com) and create a new **Web Service**.
3. Link your GitHub repository and point the **Root Directory** field specifically to `backend`.
4. Set the **Build Command** to tell Render to spin up your dependencies inside its container environment: `python -m venv venv && source venv/bin/activate && pip install -r requirements.txt`
5. Set the **Start Command** to activate your environment and ignite the server: `source venv/bin/activate && python main.py`
6. Open the **Environment Variables** panel in Render and securely inject your `GEMINI_API_KEY` or `GROQ_API_KEY`. Save and deploy.

### Frontend (Vercel Deployment)

1. Log into the [Vercel Dashboard](https://vercel.com) and click **Add New Project**.
2. Select your `SmartIQ` GitHub repository.
3. In the framework configurations, set the **Root Directory** specifically to `frontend`.
4. Leave the default build configurations intact and hit **Deploy**. Vercel will instantly generate a live production URL making SmartIQ accessible to any web browser globally!
