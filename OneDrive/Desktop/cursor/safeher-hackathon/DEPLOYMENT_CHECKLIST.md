# ✅ SafeHer Deployment Checklist

## Pre-Deployment Checklist

### Backend (Render)
- [ ] Code pushed to GitHub
- [ ] MongoDB Atlas cluster created
- [ ] Database user created with proper permissions
- [ ] IP whitelist configured (0.0.0.0/0)
- [ ] Connection string ready
- [ ] Environment variables prepared:
  - [ ] `NODE_ENV=production`
  - [ ] `PORT=10000`
  - [ ] `MONGO_URI=mongodb+srv://...`
  - [ ] `FRONTEND_URL=https://your-frontend.netlify.app`
  - [ ] `TWILIO_SID` (optional)
  - [ ] `TWILIO_AUTH` (optional)
  - [ ] `TWILIO_FROM` (optional)
  - [ ] `EMERGENCY_NUMBERS` (optional)

### Frontend (Netlify)
- [ ] Build command: `npm run build`
- [ ] Publish directory: `frontend/dist`
- [ ] Environment variable: `VITE_BACKEND_URL=https://your-backend.onrender.com`
- [ ] Base directory: `frontend`

## Post-Deployment Testing

### Backend Tests
- [ ] Health check: `GET /api/health`
- [ ] SOS endpoint: `POST /sos`
- [ ] Get alerts: `GET /sos`
- [ ] Statistics: `GET /api/stats`

### Frontend Tests
- [ ] Page loads without errors
- [ ] Geolocation works
- [ ] Map displays correctly
- [ ] SOS button functions
- [ ] Voice recognition works
- [ ] Event logs update
- [ ] Backend communication works

### Integration Tests
- [ ] Frontend can send SOS to backend
- [ ] Backend saves SOS to database
- [ ] SMS alerts work (if configured)
- [ ] CORS allows frontend requests

## Quick Commands

### Test Backend
```bash
# Health check
curl https://your-backend.onrender.com/api/health

# Send test SOS
curl -X POST https://your-backend.onrender.com/sos \
  -H "Content-Type: application/json" \
  -d '{"userId":"TestUser","lat":40.7128,"lng":-74.0060,"source":"manual","timestamp":"2025-01-20T10:00:00.000Z"}'
```

### Test Frontend
```bash
# Build locally
cd frontend
npm run build
npm run preview
```

## Environment Variables Reference

### Backend (.env on Render)
```
NODE_ENV=production
PORT=10000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/safeher-hackathon
FRONTEND_URL=https://your-frontend.netlify.app
TWILIO_SID=your_twilio_account_sid
TWILIO_AUTH=your_twilio_auth_token
TWILIO_FROM=+1234567890
EMERGENCY_NUMBERS=+91xxxxxxxxxx,+91yyyyyyyyyy
```

### Frontend (Environment Variables on Netlify)
```
VITE_BACKEND_URL=https://your-backend.onrender.com
```

## URLs After Deployment
- Frontend: `https://your-site-name.netlify.app`
- Backend: `https://your-service-name.onrender.com`
- API Health: `https://your-service-name.onrender.com/api/health`
