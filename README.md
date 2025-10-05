# Kunal AI - Multi-Feature AI Assistant

A full-stack AI-powered application featuring three intelligent tools: Q&A Bot, Text Summarizer, and Expense Tracker. Built with React, TypeScript, Flask, and Google Gemini AI.

![Kunal AI](https://img.shields.io/badge/AI-Powered-blue)
![Flask](https://img.shields.io/badge/Flask-3.0.3-green)
![React](https://img.shields.io/badge/React-18.3.1-61dafb)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue)

## 🌟 Features

### 1. **Q&A Bot**
- Interactive question-answering system powered by Google Gemini
- Real-time streaming responses with character-by-character display
- Natural language understanding for diverse queries

### 2. **Text Summarizer**
- Intelligent text summarization using AI
- Extracts key points from long documents
- Clean, concise summaries

### 3. **Expense Tracker**
- AI-powered expense management
- Natural language input (e.g., "add $20 for coffee")
- Track spending with conversational commands

## 🏗️ Tech Stack

### Frontend
- **Framework**: React 18.3.1 with TypeScript
- **Build Tool**: Vite 5.4.19
- **UI Components**: Shadcn UI (Radix UI primitives)
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **State Management**: TanStack Query
- **Deployment**: Vercel

### Backend
- **Framework**: Flask 3.0.3
- **AI Integration**: LangChain + Google Gemini AI
- **CORS**: Flask-CORS
- **Server**: Gunicorn
- **Deployment**: Railway

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **Python** (v3.11 or higher)
- **pip** (Python package manager)
- **npm** or **yarn** (Node package manager)
- **Google Gemini API Key** ([Get one here](https://makersuite.google.com/app/apikey))

## 🚀 Local Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Hiteshydv001/Internship-assesment.git
cd Internship-assesment
```

### 2. Backend Setup

#### Navigate to backend directory
```bash
cd backend
```

#### Create virtual environment (recommended)
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

#### Install dependencies
```bash
pip install -r requirements.txt
```

#### Create `.env` file
Create a `.env` file in the `backend` directory:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

Replace `your_gemini_api_key_here` with your actual Google Gemini API key.

#### Run the backend server
```bash
# Development mode
python main.py

# Production mode with Gunicorn
gunicorn main:app --bind 0.0.0.0:5001 --workers 2
```

The backend server will start at `http://localhost:5001`

### 3. Frontend Setup

#### Navigate to frontend directory (from root)
```bash
cd frontend
```

#### Install dependencies
```bash
npm install
# or
yarn install
```

#### Create `.env` file (optional)
Create a `.env` file in the `frontend` directory:

```env
VITE_API_URL=http://localhost:5001/api
```

#### Run the development server
```bash
npm run dev
# or
yarn dev
```

The frontend will start at `http://localhost:5173`

## 📂 Project Structure

```
Internship-assign/
├── backend/
│   ├── app/
│   │   ├── __init__.py          # Flask app factory with CORS config
│   │   ├── api/
│   │   │   ├── qna.py           # Q&A endpoint with streaming
│   │   │   ├── summarizer.py    # Summarization endpoint
│   │   │   └── tracker.py       # Expense tracker endpoint
│   │   └── core/
│   │       └── agents.py        # LangChain agent configurations
│   ├── config.py                # Configuration management
│   ├── main.py                  # Flask application entry point
│   └── requirements.txt         # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── features/        # Feature-specific components
│   │   │   ├── layout/          # Layout components (Navbar, Footer)
│   │   │   └── ui/              # Shadcn UI components
│   │   ├── pages/               # Route pages
│   │   ├── lib/
│   │   │   ├── api.ts           # API client functions
│   │   │   └── utils.ts         # Utility functions
│   │   ├── App.tsx              # Main app component
│   │   └── main.tsx             # Entry point
│   ├── package.json             # Node dependencies
│   └── vite.config.ts           # Vite configuration
├── Dockerfile                   # Docker configuration for backend
└── README.md                    # This file
```

## 🔧 Environment Variables

### Backend (`backend/.env`)
| Variable | Description | Required |
|----------|-------------|----------|
| `GEMINI_API_KEY` | Google Gemini API key | Yes |

### Frontend (`frontend/.env`)
| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:5001/api` |

## 🐳 Docker Deployment

### Build Docker Image
```bash
docker build -t kunal-ai-backend .
```

### Run Docker Container
```bash
docker run -p 8080:8080 -e GEMINI_API_KEY=your_api_key kunal-ai-backend
```

## 🌐 Production Deployment

### Backend (Railway)
1. Push your code to GitHub
2. Connect your repository to Railway
3. Add `GEMINI_API_KEY` environment variable
4. Railway will automatically deploy using the Dockerfile

**Live Backend URL**: `https://internship-assesment-production.up.railway.app`

### Frontend (Vercel)
1. Push your code to GitHub
2. Import project to Vercel
3. Set environment variable:
   - `VITE_API_URL=https://internship-assesment-production.up.railway.app/api`
4. Deploy

**Live Frontend URL**: `https://internship-assesment-git-main-hitesh-kumars-projects-788f775a.vercel.app`

## 🔌 API Endpoints

### Health Check
```
GET /api/health
```
Returns API status

### Q&A Bot
```
POST /api/qna
Content-Type: application/json

{
  "question": "What is machine learning?"
}
```
Returns streaming text response

### Summarizer
```
POST /api/summarize
Content-Type: application/json

{
  "text": "Long text to summarize..."
}
```
Returns JSON with summary

### Expense Tracker
```
POST /api/tracker
Content-Type: application/json

{
  "prompt": "add $50 for groceries"
}
```
Returns JSON with tracker response

## 🛠️ Development

### Run Tests
```bash
# Backend
cd backend
python -m pytest

# Frontend
cd frontend
npm run test
```

### Lint Code
```bash
# Frontend
cd frontend
npm run lint
```

### Build for Production
```bash
# Frontend
cd frontend
npm run build
```

## 🐛 Troubleshooting

### CORS Issues
If you encounter CORS errors:
1. Ensure `VITE_API_URL` includes `/api` suffix
2. Check that backend CORS is configured for your frontend origin
3. Verify the API endpoints are correct (`/api/qna`, not `/qna`)

### API Key Errors
If you get API key errors:
1. Verify your `.env` file exists in the `backend` directory
2. Ensure `GEMINI_API_KEY` is set correctly
3. Restart the backend server after adding the key

### Port Conflicts
If ports are already in use:
- Backend: Change port in `main.py` (default: 5001)
- Frontend: Change port in `vite.config.ts` or use `--port` flag

## 📝 License

This project is created as part of an internship assessment.

## 👤 Author

**Hitesh Kumar**
- GitHub: [@Hiteshydv001](https://github.com/Hiteshydv001)
- Repository: [Internship-assesment](https://github.com/Hiteshydv001/Internship-assesment)

## 🙏 Acknowledgments

- Google Gemini AI for powering the AI features
- Shadcn UI for beautiful components
- LangChain for AI agent orchestration
- Flask and React communities

---

**Made with ❤️ for Kunal AI Internship Assessment**
