# 🚀 SafeHer Deployment Guide

This guide will help you deploy the SafeHer Emergency SOS App to production.

## 📋 Prerequisites

- GitHub account
- MongoDB Atlas account (for database)
- Render account (for backend)
- Netlify account (for frontend)
- Twilio account (optional, for SMS alerts)

---

## 🔧 Backend Deployment on Render

### Step 1: Prepare Your Repository

1. **Push your code to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial SafeHer project setup"
   git branch -M main
   git remote add origin https://github.com/yourusername/safeher-hackathon.git
   git push -u origin main
   ```

### Step 2: Create MongoDB Database

1. **Go to [MongoDB Atlas](https://www.mongodb.com/atlas)**
2. **Create a new cluster** (free tier is fine)
3. **Create a database user:**
   - Username: `safeher-user`
   - Password: Generate a strong password
4. **Whitelist IP addresses:**
   - Add `0.0.0.0/0` for all IPs (or specific Render IPs)
5. **Get your connection string:**
   ```
   mongodb+srv://safeher-user:yourpassword@cluster0.xxxxx.mongodb.net/safeher-hackathon?retryWrites=true&w=majority
   ```

### Step 3: Deploy to Render

1. **Go to [Render](https://render.com) and sign up/login**
2. **Click "New +" → "Web Service"**
3. **Connect your GitHub repository**
4. **Configure the service:**

   **Basic Settings:**
   - **Name:** `safeher-backend`
   - **Environment:** `Node`
   - **Region:** Choose closest to your users
   - **Branch:** `main`
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`

   **Advanced Settings:**
   - **Node Version:** `18` or `20`
   - **Auto-Deploy:** `Yes`

5. **Set Environment Variables:**
   ```
   NODE_ENV=production
   PORT=10000
   MONGO_URI=mongodb+srv://safeher-user:yourpassword@cluster0.xxxxx.mongodb.net/safeher-hackathon?retryWrites=true&w=majority
   FRONTEND_URL=https://your-frontend-url.netlify.app
   
   # Optional Twilio Configuration
   TWILIO_SID=your_twilio_account_sid
   TWILIO_AUTH=your_twilio_auth_token
   TWILIO_FROM=+1234567890
   EMERGENCY_NUMBERS=+91xxxxxxxxxx,+91yyyyyyyyyy
   ```

6. **Click "Create Web Service"**
7. **Wait for deployment** (5-10 minutes)
8. **Your backend URL will be:** `https://safeher-backend.onrender.com`

### Step 4: Test Backend Deployment

```bash
# Health check
curl https://safeher-backend.onrender.com/api/health

# Test SOS endpoint
curl -X POST https://safeher-backend.onrender.com/sos \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "TestUser",
    "lat": 40.7128,
    "lng": -74.0060,
    "source": "manual",
    "timestamp": "2025-01-20T10:00:00.000Z"
  }'
```

---

## 🎨 Frontend Deployment on Netlify

### Step 1: Prepare Frontend for Production

1. **Update frontend environment:**
   ```bash
   cd frontend
   echo "VITE_BACKEND_URL=https://safeher-backend.onrender.com" > .env.production
   ```

2. **Test build locally:**
   ```bash
   npm run build
   # This creates a 'dist' folder
   ```

### Step 2: Deploy to Netlify

1. **Go to [Netlify](https://netlify.com) and sign up/login**
2. **Click "Add new site" → "Import an existing project"**
3. **Connect to Git provider (GitHub)**
4. **Select your repository**
5. **Configure build settings:**

   **Build Settings:**
   - **Base directory:** `frontend`
   - **Build command:** `npm run build`
   - **Publish directory:** `frontend/dist`
   - **Node version:** `18` or `20`

6. **Set Environment Variables:**
   - **Variable name:** `VITE_BACKEND_URL`
   - **Value:** `https://safeher-backend.onrender.com`

7. **Click "Deploy site"**
8. **Wait for deployment** (3-5 minutes)
9. **Your frontend URL will be:** `https://amazing-name-123456.netlify.app`

### Step 3: Update Backend CORS

1. **Go back to Render dashboard**
2. **Update environment variable:**
   ```
   FRONTEND_URL=https://amazing-name-123456.netlify.app
   ```
3. **Redeploy the backend**

---

## 🧪 Testing Your Live Demo

### 1. Test Frontend
- Visit your Netlify URL
- Allow geolocation when prompted
- Click the red SOS button
- Check the event logs

### 2. Test Voice Recognition
- Click "Start Listening"
- Say "help me" or "I need help"
- Verify SOS is sent automatically

### 3. Test Backend API
```bash
# Get all SOS alerts
curl https://safeher-backend.onrender.com/sos

# Get statistics
curl https://safeher-backend.onrender.com/api/stats
```

### 4. Test SMS Alerts (Optional)
- Configure Twilio credentials in Render
- Send an SOS from the frontend
- Check your emergency contact numbers for SMS

---

## 🔧 Troubleshooting

### Common Issues:

1. **Backend not starting:**
   - Check MongoDB connection string
   - Verify environment variables
   - Check Render logs

2. **Frontend not connecting to backend:**
   - Verify `VITE_BACKEND_URL` is set correctly
   - Check CORS settings in backend
   - Ensure backend is running

3. **MongoDB connection issues:**
   - Verify IP whitelist includes `0.0.0.0/0`
   - Check username/password
   - Ensure cluster is running

4. **SMS not working:**
   - Verify Twilio credentials
   - Check phone number format (+country code)
   - Ensure Twilio account has credits

---

## 📱 Final Demo URLs

After successful deployment, you'll have:

- **Frontend:** `https://amazing-name-123456.netlify.app`
- **Backend:** `https://safeher-backend.onrender.com`
- **API Health:** `https://safeher-backend.onrender.com/api/health`

---

## 🎯 Demo Script

1. **Open the frontend URL**
2. **Show the map with user location**
3. **Demonstrate manual SOS button**
4. **Show voice recognition feature**
5. **Display real-time event logs**
6. **Show backend API responses**
7. **Demonstrate SMS alerts (if configured)**

---

## 💡 Pro Tips

1. **Use custom domains** for professional presentation
2. **Set up monitoring** with Render and Netlify analytics
3. **Configure auto-deployment** from main branch
4. **Use environment-specific configurations**
5. **Set up error tracking** (Sentry, LogRocket)

---

## 🆘 Support

If you encounter issues:
1. Check the deployment logs in Render/Netlify
2. Verify all environment variables are set
3. Test API endpoints individually
4. Check browser console for frontend errors

**Happy Deploying! 🚀**
