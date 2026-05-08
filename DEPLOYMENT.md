# Nexus Deployment Guide

## Architecture Overview

The Nexus application uses a **three-layer deployment** with origin-aware backend routing:

- **Frontend**: Hosted on Vercel (`https://nexus40.vercel.app`)
- **Backend**: Hosted on Render (`https://nexus-h82b.onrender.com`)
- **Database**: MongoDB Atlas (shared across deployments)

## Request Flow

### Local Development
```
Browser (localhost:5173)
    ↓
Vite dev server proxy
    ↓ (/api → localhost:5000)
Backend server (localhost:5000)
```

**Setup:**
- Run `cd server && npm run dev` (port 5000)
- Run `cd client && npm run dev` (port 5173)
- Client uses relative `/api` paths, Vite proxy routes to backend

### Production (Vercel + Render)
```
Browser (https://nexus40.vercel.app)
    ↓
Vercel rewrite rule (vercel.json)
    ↓ (/api → https://nexus-h82b.onrender.com/api)
Render backend (https://nexus-h82b.onrender.com)
    ↓
MongoDB Atlas
```

**How it works:**
- Client requests `https://nexus40.vercel.app/api/auth/login`
- Vercel rewrite rule forwards to `https://nexus-h82b.onrender.com/api/auth/login`
- Backend CORS allows origin `https://nexus40.vercel.app`
- Response flows back through Vercel with CORS headers

## Configuration Files

### Backend: `server/.env`
```env
PORT=5000
NODE_ENV=development
MONGO_URI=<your-mongodb-uri>
JWT_ACCESS_SECRET=<your-secret>
JWT_REFRESH_SECRET=<your-secret>
CLIENT_URL=http://localhost:5173
```

For **Render deployment**, set:
```env
NODE_ENV=production
CLIENT_URL=https://nexus40.vercel.app
```

### Frontend: Client environment files

- **`.env.local`** (development): `VITE_API_URL=http://localhost:5000/api`
- **`.env.production`** (Vercel): Omit `VITE_API_URL` → defaults to `/api` → Vercel rewrites to Render
- **`vercel.json`**: Rewrite rule proxies `/api/*` to `https://nexus-h82b.onrender.com/api/$1`

## CORS Configuration

The backend (`server/src/app.js`) allows:
- **Development**: All origins (permissive for dev)
- **Production**: 
  - `http://localhost:5173` (dev fallback)
  - `https://nexus40.vercel.app` (Vercel frontend)

The backend automatically detects request origin and sets:
- `req.backendBaseUrl`: `http://localhost:5000` (local) or `https://nexus-h82b.onrender.com` (Vercel)
- `req.clientBaseUrl`: Used for generating invitation links in emails

## Deployment Checklist

### 1. Deploy Backend to Render
```bash
# Push to GitHub
git push origin main

# Render auto-deploys from GitHub
# Ensure Render environment has:
- MONGO_URI
- JWT_ACCESS_SECRET
- JWT_REFRESH_SECRET
- NODE_ENV=production
- CLIENT_URL=https://nexus40.vercel.app
```

### 2. Deploy Frontend to Vercel
```bash
# Push to GitHub
git push origin main

# Vercel auto-deploys from GitHub
# Ensure Vercel has:
- Build command: npm run build (in client/)
- Output directory: dist/
- Environment: .env.production is auto-used in production
```

### 3. Test Production Flow
```bash
# Test with curl (simulates browser Origin header)
curl -X POST \
  -H "Origin: https://nexus40.vercel.app" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"pass"}' \
  https://nexus40.vercel.app/api/auth/login

# Should return 401 (bad credentials) or 200 (success), NOT 405 or CORS error
```

## Troubleshooting

### 405 Method Not Allowed on Production
- **Issue**: Frontend returns `index.html` instead of proxying to backend
- **Fix**: Ensure `client/vercel.json` has the `/api` rewrite rule before the catch-all
- **Verify**: Check Vercel deployment logs for rewrite rules

### CORS Error
- **Issue**: `Access-Control-Allow-Origin` header missing
- **Fix**: Ensure `CLIENT_URL` is set correctly on backend and matches request origin
- **Verify**: Run `curl -i -H "Origin: https://nexus40.vercel.app" https://nexus-h82b.onrender.com/api/config`

### 401 Unauthorized (Expected)
- This is **normal** and means CORS and routing are working
- Indicates login credentials are invalid, not an infrastructure issue

## Environment-Aware Backend URLs

Invitation emails and other generated links use the correct domain based on request origin:

- Request from `localhost` → links use `http://localhost:5173`
- Request from `nexus40.vercel.app` → links use `https://nexus40.vercel.app`

This is handled by middleware in `server/src/app.js` that inspects the `Origin` header and sets `req.clientBaseUrl` and `req.backendBaseUrl` accordingly.

## API Endpoint Discovery

**Local Development**: `http://localhost:5000/api/config`
- Returns: `{ backendBaseUrl: "http://localhost:5000", clientBaseUrl: "http://localhost:5173" }`

**Production**: `https://nexus40.vercel.app/api/config`
- Returns: `{ backendBaseUrl: "https://nexus-h82b.onrender.com", clientBaseUrl: "https://nexus40.vercel.app" }`

Useful for debugging and verifying origin detection is working correctly.
