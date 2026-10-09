# 🌌 AI Nexus — Unified AI Learning & Discovery Platform

> **Full-Stack Monorepo:** Frontend and Backend unified in a single repository on the `main` branch.

[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![Express](https://img.shields.io/badge/Express-4.21-lightgrey.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-brightgreen.svg)](https://mongoosejs.com/)
[![Gemini AI](https://img.shields.io/badge/Google_Gemini-API-orange.svg)](https://ai.google.dev/)

---

## 📁 Monorepo Architecture

Both frontend and backend are housed within this single branch:

```text
AI-Learning-Platform/
├── backend/                  # Node.js + Express API server
│   ├── models/               # Mongoose schemas (AITool, LearningResource, etc.)
│   ├── routes/               # REST API endpoints (tools, search, learning, etc.)
│   ├── services/             # Gemini AI discovery service (gemini-3.5-flash)
│   ├── seed.js               # Database seeder (360+ AI tools, 8 courses, 27 repos)
│   ├── server.js             # Express entry point
│   └── .env.example          # Backend environment variables template
│
├── frontend/                 # React 19 + Vite web application
│   ├── src/
│   │   ├── components/       # UI components (search, learning, categories, etc.)
│   │   ├── pages/            # Routes (HomePage, ToolsPage, LearnPage, OpenSourcePage)
│   │   └── services/         # Axios API client
│   └── .env.example          # Frontend environment variables template
│
├── scripts/                  # Unified automation scripts
│   └── dev.mjs               # Concurrent backend + frontend runner
├── package.json              # Root workspace config & unified scripts
└── README.md                 # Project documentation
```

---

## ⚡ Quick Start

### 1. Install Dependencies
```bash
npm run install:all
```
*(Or install separately inside `/backend` and `/frontend`)*

### 2. Configure Environment Variables

**Backend (`backend/.env`):**
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/ai_nexus
JWT_SECRET=your_secret_key_here
CLIENT_URL=http://localhost:5173
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-3.5-flash
```

**Frontend (`frontend/.env`):**
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Run Both Services Concurrently
From the root directory:
```bash
npm run dev
```

- **Frontend:** [http://localhost:5173](http://localhost:5173)
- **Backend API:** [http://localhost:5000](http://localhost:5000)
- **Health Check:** [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 🧠 Key Features

- **360+ Curated AI Tools Directory:** Categorized across 29 AI domains with search, filter, tags, and detail view.
- **Gemini Neural Search:** Real-time semantic discovery powered by Google Gemini with multi-model fallback.
- **Interactive Learning Tracks:** 8 comprehensive video courses with tracked module progress.
- **Open-Source AI Hub:** 27 repositories with interactive architecture breakdowns and roadmaps.
