# ProfileRAG Deployment Guide

## Recommended: Deploy on Render (Free Tier Available)

Your app has a Python backend (FastAPI) + React frontend, which requires a service that supports Python runtime.

### Option 1: Render.com (Recommended - Easiest)

**Pricing:** Free tier available, $7/mo for always-on

#### Step 1: Prepare your repo
1. Push your code to GitHub:
```bash
cd /Users/tungalag/GANA/ProfileRAG
git add .
git commit -m "Prepare for deployment"
git push origin main
```

#### Step 2: Deploy Backend
1. Go to [render.com](https://render.com) and sign up
2. Click "New" → "Web Service"
3. Connect your GitHub repo
4. Configure:
   - **Name:** `profilerag-api`
   - **Root Directory:** (leave empty)
   - **Runtime:** Python 3
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Add Environment Variables:
   - `OPENAI_API_KEY` = your key
   - `ALLOWED_ORIGINS` = `https://ganabattumur.com,https://profilerag-frontend.onrender.com`
6. Click "Create Web Service"

#### Step 3: Deploy Frontend
1. Click "New" → "Static Site"
2. Connect same GitHub repo
3. Configure:
   - **Name:** `profilerag-frontend`
   - **Root Directory:** `frontend`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`
4. Add Environment Variables:
   - `VITE_API_URL` = `https://profilerag-api.onrender.com` (your backend URL from Step 2)
5. Click "Create Static Site"

#### Step 4: Connect Custom Domain (ganabattumur.com)
1. Buy domain from IONOS ($1/year)
2. In Render dashboard → your frontend → Settings → Custom Domains
3. Add `ganabattumur.com` and `www.ganabattumur.com`
4. In IONOS DNS settings, add:
   - **A Record:** `@` → Render's IP (shown in dashboard)
   - **CNAME:** `www` → `profilerag-frontend.onrender.com`

---

### Option 2: Railway.app

**Pricing:** $5 credit/month free, then usage-based

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
cd /Users/tungalag/GANA/ProfileRAG
railway init

# Deploy backend
railway up

# Set environment variables in Railway dashboard
# OPENAI_API_KEY, ALLOWED_ORIGINS
```

For frontend, deploy to Vercel or Railway's static hosting.

---

### Option 3: Fly.io

**Pricing:** Generous free tier

```bash
# Install flyctl
brew install flyctl

# Login
fly auth login

# Launch app (uses Dockerfile)
cd /Users/tungalag/GANA/ProfileRAG
fly launch

# Deploy
fly deploy

# Set secrets
fly secrets set OPENAI_API_KEY=your_key
```

---

## IONOS Setup (Domain Only)

IONOS is great for the **domain name** ($1/year for ganabattumur.com), but use Render/Railway for hosting.

### DNS Configuration in IONOS:

After deploying to Render, configure these DNS records:

| Type | Host | Value |
|------|------|-------|
| A | @ | (Render IP - get from dashboard) |
| CNAME | www | profilerag-frontend.onrender.com |

---

## Quick Start Summary

1. **Buy domain:** IONOS → ganabattumur.com ($1/year)
2. **Deploy backend:** Render → Web Service → Python
3. **Deploy frontend:** Render → Static Site
4. **Connect domain:** Add DNS records in IONOS pointing to Render

Your portfolio will be live at **https://ganabattumur.com** 🎉
