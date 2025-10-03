# 🐳 Quick Docker Deployment Guide

## 🚀 Deploy to Railway with Docker

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Add Docker configuration"
git push
```

### Step 2: Create Railway Project
1. Go to https://railway.app
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your repository

### Step 3: Configure Railway
1. **Set Root Directory:**
   - Go to Settings
   - Set "Root Directory" to `backend`
   
2. **Set Environment Variables:**
   - Go to Variables tab
   - Add:
     ```
     GOOGLE_API_KEY=your_gemini_api_key
     FLASK_ENV=production
     ```

### Step 4: Get Your URL
- Railway will auto-deploy using the Dockerfile
- Get URL from Settings → Domains
- Example: `https://your-app.up.railway.app`

### Step 5: Update Frontend
In `frontend/.env`:
```env
VITE_API_URL=https://your-app.up.railway.app
```

## 🧪 Test Locally First

```bash
# Navigate to backend
cd backend

# Build Docker image
docker build -t kunal-ai-backend .

# Run container
docker run -p 5001:5001 -e GOOGLE_API_KEY=your_key kunal-ai-backend

# Test
curl http://localhost:5001/api/health
```

## 📁 Files Created

✅ `backend/Dockerfile` - Docker configuration
✅ `backend/docker-compose.yml` - Local development setup
✅ `backend/.gitignore` - Protects sensitive files
✅ `backend/.env.example` - Environment template
✅ `DOCKER_DEPLOYMENT.md` - Full documentation

## 🎯 What Railway Does Automatically

1. ✅ Detects your Dockerfile
2. ✅ Builds the Docker image
3. ✅ Deploys the container
4. ✅ Assigns a public URL
5. ✅ Auto-redeploys on git push
6. ✅ Provides logs and monitoring

That's it! Your backend will be live in minutes. 🚀
