# ⚡ Quick Deploy Guide

## 🚀 One-Click Deployment Steps

### 1. Backend on Render (5 minutes)

1. **Go to [render.com](https://render.com)**
2. **Click "New +" → "Web Service"**
3. **Connect GitHub repo**
4. **Settings:**
   - Name: `safeher-backend`
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
5. **Environment Variables:**
   ```
   NODE_ENV=production
   PORT=10000
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/safeher-hackathon
   FRONTEND_URL=https://your-frontend.netlify.app
   ```
6. **Deploy!** → Get URL: `https://safeher-backend.onrender.com`

### 2. Frontend on Netlify (3 minutes)

1. **Go to [netlify.com](https://netlify.com)**
2. **Click "Add new site" → "Import from Git"**
3. **Select your repo**
4. **Build Settings:**
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `frontend/dist`
5. **Environment Variables:**
   ```
   VITE_BACKEND_URL=https://safeher-backend.onrender.com
   ```
6. **Deploy!** → Get URL: `https://amazing-name-123456.netlify.app`

### 3. Update Backend CORS

1. **Go back to Render**
2. **Update environment variable:**
   ```
   FRONTEND_URL=https://amazing-name-123456.netlify.app
   ```
3. **Redeploy**

## ✅ Test Your Live App

1. **Visit your Netlify URL**
2. **Allow geolocation**
3. **Click SOS button**
4. **Test voice: say "help me"**
5. **Check event logs**

## 🎯 Demo Ready!

Your SafeHer app is now live and ready for the hackathon demo!

**Frontend:** `https://your-site.netlify.app`  
**Backend:** `https://your-backend.onrender.com`
