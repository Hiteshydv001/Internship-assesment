# 🚂 Railway Deployment - IMPORTANT SETUP

## ⚠️ CRITICAL: Set Root Directory in Railway Dashboard

Railway is trying to build from the repo root, but your app is in the `backend/` folder.

### Step-by-Step Fix:

1. **Go to your Railway project dashboard**
   
2. **Click on your service** (the one that's failing to build)

3. **Go to "Settings" tab**

4. **Scroll down to find "Root Directory"**

5. **Set it to:** `backend`
   
6. **Click "Save"** or it will auto-save

7. **Redeploy** - Railway will automatically trigger a new deployment

### Alternative: Deploy from Railway Dashboard (Fresh Start)

If the above doesn't work, delete the service and recreate:

1. **Delete current failing service** in Railway

2. **Click "New" → "Deploy from GitHub repo"**

3. **Select your repository:** `Internship-assesment`

4. **IMPORTANT:** After selecting the repo, you'll see a settings panel
   
5. **Set "Root Directory" to:** `backend` **BEFORE** clicking Deploy

6. **Click "Deploy"**

### What Files Are Configured:

✅ `backend/Dockerfile` - Docker build configuration
✅ `backend/railway.toml` - Railway-specific settings
✅ `backend/nixpacks.toml` - Nixpacks build configuration (fallback)
✅ `backend/requirements.txt` - Python dependencies

### Environment Variables to Set:

After deployment starts, add these in **Variables** tab:

```
GOOGLE_API_KEY=your_gemini_api_key_here
FLASK_ENV=production
PORT=5001
```

### Expected Build Process:

1. Railway detects Dockerfile in `backend/` folder
2. Builds Docker image using Python 3.11
3. Installs dependencies from requirements.txt
4. Runs gunicorn with 2 workers
5. Exposes on port from $PORT variable

### If Still Failing:

**Check Railway Logs:**
- Go to "Deployments" tab
- Click on the latest deployment
- Check "Build Logs" and "Deploy Logs"
- Share any errors you see

**Common Issues:**
- ❌ Root directory not set to `backend`
- ❌ Missing GOOGLE_API_KEY environment variable
- ❌ Trying to build from repo root instead of backend folder

### Success Indicators:

✅ Build logs show "Using Detected Dockerfile"
✅ Build logs show "Successfully built" 
✅ Deploy logs show "gunicorn" starting
✅ Health check passes at `/api/health`

---

## 📞 Need Help?

If you're still getting errors after setting the root directory to `backend`, paste the build logs and I'll help debug!
