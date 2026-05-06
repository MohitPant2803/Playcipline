# Vercel Deployment Guide - Complete Setup

## Overview
This project is now configured for Vercel's monorepo deployment with:
- React Vite client served from `client/dist`
- Express API as serverless functions
- Automatic SPA routing for React

## Prerequisites
1. GitHub account with this repo pushed
2. MongoDB Atlas cluster (free tier available)
3. Google OAuth credentials (for authentication)
4. Vercel account

## Step 1: Get Your Credentials

### MongoDB Atlas Setup
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user and get connection string
4. Update `MONGODB_URI` with your connection string

### Google OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project: "Challengeloop"
3. Enable OAuth 2.0 and create credentials (OAuth Client ID)
4. Add authorized JavaScript origins:
   - `https://your-app.vercel.app`
   - `http://localhost:5173` (for development)
5. Add authorized redirect URIs:
   - `https://your-app.vercel.app/api/auth/google/callback`
   - `http://localhost:5000/api/auth/google/callback` (for development)
6. Get your `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`

## Step 2: Deploy to Vercel

### Via Vercel Dashboard (Recommended)
1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Select your GitHub repository
4. **Important**: Configure environment variables before deploying
5. Click "Deploy"

### Environment Variables to Set in Vercel Dashboard
Go to Project Settings → Environment Variables and add:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/challengeloop
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
JWT_SECRET=generate-a-long-random-string-here
CLIENT_URL=https://your-app.vercel.app
NODE_ENV=production
ALLOWED_ORIGINS=https://your-app.vercel.app
```

### Via CLI
```bash
npm i -g vercel
vercel login
vercel --prod
```

## Step 3: Verify Deployment

### Check API
```bash
# Health check
curl https://your-app.vercel.app/api/health

# Should return:
# {"status":"ok","database":"connected"}
```

### Check Client
- Visit `https://your-app.vercel.app`
- Should see the login page (not a white screen)

## Troubleshooting

### White Screen on Client
- **Solution**: Clear browser cache (Ctrl+Shift+Delete)
- Check browser console (F12) for errors
- Verify `VITE_API_BASE_URL` is set if you have a custom API domain

### API Returns 404 on Deployed Site
- Verify `MONGODB_URI` is set in Vercel environment variables
- Check API logs: `vercel logs --follow`
- Ensure database network access is allowed from Vercel IPs

### CORS Errors
- API already configured to allow all origins
- If still having issues, check browser console for exact error
- Add `https://your-app.vercel.app` to Google OAuth origins

### Database Connection Issues
- Verify `MONGODB_URI` format: `mongodb+srv://user:password@cluster.mongodb.net/database`
- Check MongoDB Atlas network access settings (should allow all IPs for ease)
- Ensure user password doesn't have special characters or URL-encode them

## Local Development vs Vercel

### Environment Variables Location

**Local Development** (`.env` file):
- Place in root directory
- Used by both `npm run dev:api` and `npm run dev:client`

**Vercel** (Dashboard):
- Set in Project Settings → Environment Variables
- Applied during build and runtime

## Project Structure

```
.
├── api/                    # Express backend (serverless)
│   ├── index.js           # Main server
│   ├── routes/            # API routes
│   └── models/            # Database models
├── client/                # React frontend
│   ├── src/
│   └── vite.config.js
├── api.js                 # Vercel serverless wrapper
├── vercel.json            # Vercel configuration
└── package.json           # Monorepo root
```

## Key Vercel Configuration (vercel.json)

- **buildCommand**: `npm run build` (builds client only)
- **outputDirectory**: `client/dist` (serves React app from here)
- **functions**: Defines `api.js` as serverless function
- **rewrites**: Routes `/api/*` to serverless function, all other paths to React SPA

## Production Checklist

- [ ] MongoDB URI set in Vercel
- [ ] Google OAuth credentials in Vercel
- [ ] JWT_SECRET set to strong random value
- [ ] CLIENT_URL matches your Vercel domain
- [ ] Google OAuth redirect URIs updated
- [ ] Database has necessary collections
- [ ] API health check passes: `/api/health`
- [ ] Client loads without errors
- [ ] Can login successfully
- [ ] API calls work from client

## Running Commands

```bash
# Local development
npm run dev

# Build for production
npm run build

# Test production build locally
npm run preview

# View Vercel logs
vercel logs --follow

# Redeploy
vercel --prod
```

## Additional Resources

- [Vercel Monorepo Guide](https://vercel.com/docs/concepts/monorepos)
- [Vite Deployment](https://vitejs.dev/guide/build.html)
- [Express on Vercel](https://vercel.com/docs/runtimes/nodejs)
