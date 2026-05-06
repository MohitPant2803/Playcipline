# Vercel Deployment - Complete Step-by-Step Guide

This guide walks you through deploying Challengeloop to Vercel with production-ready configuration.

---

## Prerequisites

Before starting, ensure you have:
- [ ] GitHub account and repository with your code pushed
- [ ] Vercel account (free tier available at [vercel.com](https://vercel.com))
- [ ] MongoDB Atlas account (free tier at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas))
- [ ] Google Cloud Console project with OAuth credentials

---

## Phase 1: MongoDB Atlas Setup

### Step 1.1: Create MongoDB Cluster

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign in or create a free account
3. Click **"Create a new cluster"**
4. Choose **"M0 Free"** tier
5. Select your preferred cloud provider and region
6. Click **"Create Cluster"** (wait 3-5 minutes for provisioning)

### Step 1.2: Create Database User

1. In your cluster dashboard, go to **"Security"** → **"Database Access"**
2. Click **"+ ADD NEW DATABASE USER"**
3. Choose **"Password"** authentication
4. Set username: `challengeloop`
5. Click **"Autogenerate Secure Password"** and **copy it**
6. Set **"Database User Privileges"** to **"Atlas admin"**
7. Click **"Add User"**

### Step 1.3: Whitelist IP Addresses

1. Go to **"Security"** → **"Network Access"**
2. Click **"+ ADD IP ADDRESS"**
3. For development, select **"Allow Access from Anywhere"** (0.0.0.0/0)
   - ⚠️ **For production**, add specific IPs or use Vercel's IP ranges
4. Click **"Confirm"**

### Step 1.4: Get Connection String

1. Go back to **"Clusters"** and click **"Connect"**
2. Select **"Connect your application"**
3. Choose **"Driver"** → **"Node.js"** → **"5.5 or later"**
4. Copy the connection string
5. Replace `<password>` with your database user password
6. Replace `<dbname>` with `challengeloop`

**Example:**
```
mongodb+srv://challengeloop:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/challengeloop?retryWrites=true&w=majority
```

---

## Phase 2: Google OAuth Setup

### Step 2.1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click **"Select a project"** → **"NEW PROJECT"**
3. Name it: `Challengeloop`
4. Click **"CREATE"**

### Step 2.2: Enable Google+ API

1. In your project, go to **"APIs & Services"** → **"Library"**
2. Search for **"Google+ API"**
3. Click on it and press **"Enable"**

### Step 2.3: Create OAuth Credentials

1. Go to **"APIs & Services"** → **"Credentials"**
2. Click **"+ CREATE CREDENTIALS"** → **"OAuth client ID"**
3. If prompted, configure the **"OAuth consent screen"**:
   - User Type: **"External"**
   - App name: `Challengeloop`
   - User support email: your email
   - Developer contact: your email
   - Click **"SAVE AND CONTINUE"** (skip scopes/audiences)
4. Back to **"Create OAuth Client ID"**:
   - Application type: **"Web application"**
   - Name: `Challengeloop OAuth`

### Step 2.4: Configure Authorized Origins & Redirects

**Authorized JavaScript origins:**
```
http://localhost:5000
http://localhost:5173
https://your-project.vercel.app
```

**Authorized redirect URIs:**
```
http://localhost:5000/api/auth/google/callback
https://your-project.vercel.app/api/auth/google/callback
```

5. Click **"CREATE"**
6. **Copy your Client ID and Client Secret** (you'll need these)

---

## Phase 3: Local Configuration

### Step 3.1: Create .env File

Create a `.env` file in your project root:

```env
# MongoDB
MONGODB_URI=mongodb+srv://challengeloop:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/challengeloop?retryWrites=true&w=majority

# Google OAuth
GOOGLE_CLIENT_ID=your_client_id_here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-your_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# JWT Secret (use a strong random string, min 32 chars)
JWT_SECRET=your_super_secret_key_minimum_32_characters_long

# URLs
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### Step 3.2: Test Locally

```bash
# Install dependencies
npm install

# Seed database
cd api && npm run seed

# Run both servers
cd ..
npm run dev
```

**Expected output:**
- Terminal 1 (API): `MongoDB connected` + `Server running on port 5000`
- Terminal 2 (Client): `Local: http://localhost:5173/`

Visit `http://localhost:5173` and test the Google OAuth login flow.

---

## Phase 4: GitHub Preparation

### Step 4.1: Initialize Git (if not already done)

```bash
git init
git add .
git commit -m "Ready for Vercel deployment"
git branch -M main
```

### Step 4.2: Push to GitHub

```bash
# Add remote (replace with your repo URL)
git remote add origin https://github.com/yourusername/challengeloop.git

# Push to main
git push -u origin main
```

### Step 4.3: Verify .gitignore

Ensure `.env` is in your `.gitignore` file to prevent committing secrets:

```
.env
node_modules/
dist/
```

---

## Phase 5: Vercel Deployment

### Step 5.1: Connect GitHub to Vercel

1. Go to [Vercel](https://vercel.com) and sign in
2. Click **"+ Add New..."** → **"Project"**
3. Under **"Import Git Repository"**, find and import your `challengeloop` repository
4. Click **"Import"**

### Step 5.2: Configure Build Settings

In the **"Configure Project"** step:

**Framework Preset:** `Other`

**Build and Output Settings:**
- **Build Command:** `npm run build`
- **Output Directory:** `client/dist`
- **Install Command:** `npm install`

**Functions:**
- Leave default settings (Vercel will auto-detect `api/index.js`)

### Step 5.3: Add Environment Variables

Click **"Environment Variables"** → **"+ Add"** for each:

| Name | Value | Environment |
|------|-------|-------------|
| `MONGODB_URI` | Your MongoDB Atlas connection string | Production |
| `GOOGLE_CLIENT_ID` | Your Google OAuth Client ID | Production |
| `GOOGLE_CLIENT_SECRET` | Your Google OAuth Client Secret | Production |
| `GOOGLE_CALLBACK_URL` | `https://your-project.vercel.app/api/auth/google/callback` | Production |
| `JWT_SECRET` | Strong random string (min 32 chars) | Production |
| `CLIENT_URL` | `https://your-project.vercel.app` | Production |
| `NODE_ENV` | `production` | Production |

### Step 5.4: Deploy

1. Click **"Deploy"**
2. Wait for deployment to complete (~2-3 minutes)
3. Click **"Visit"** to see your live app

---

## Phase 6: Post-Deployment Configuration

### Step 6.1: Update Google OAuth

1. Go back to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **"APIs & Services"** → **"Credentials"**
3. Edit your OAuth 2.0 Client ID
4. Add your Vercel domain to **Authorized JavaScript origins**:
   ```
   https://your-project.vercel.app
   ```
5. Verify **Authorized redirect URIs** includes:
   ```
   https://your-project.vercel.app/api/auth/google/callback
   ```
6. Click **"SAVE"**

### Step 6.2: Verify vercel.json Configuration

Your project includes a `vercel.json` file with the correct configuration. Verify it contains:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "client/dist",
  "installCommand": "npm install",
  "functions": {
    "api/index.js": {
      "memory": 1024,
      "maxDuration": 30
    }
  },
  "routes": [
    { "src": "/api/(.*)", "dest": "/api/index.js" },
    { "src": "/(.*)", "dest": "/client/dist/index.html" }
  ],
  "crons": [
    {
      "path": "/api/leaderboard/reset",
      "schedule": "0 0 * * 0"
    }
  ]
}
```

**Note:** The `vercel.json` file is already committed to your repository, so Vercel will automatically use these settings. You don't need to manually configure build settings in the Vercel dashboard.

### Step 6.3: Test Production Deployment

1. Visit your Vercel URL: `https://your-project.vercel.app`
2. Click **"Sign in with Google"**
3. Complete OAuth flow
4. Test key features:
   - Join a challenge
   - Complete a check-in
   - View leaderboard
   - Check activity feed

---

## Phase 7: Custom Domain (Optional)

### Step 7.1: Add Custom Domain in Vercel

1. Go to your Vercel project
2. Navigate to **"Settings"** → **"Domains"**
3. Add your custom domain (e.g., `challengeloop.com`)
4. Follow DNS configuration instructions

### Step 7.2: Update Environment Variables

Update these in Vercel:
- `GOOGLE_CALLBACK_URL`: `https://challengeloop.com/api/auth/google/callback`
- `CLIENT_URL`: `https://challengeloop.com`

### Step 7.3: Update Google OAuth

Add your custom domain to:
- **Authorized JavaScript origins:** `https://challengeloop.com`
- **Authorized redirect URIs:** `https://challengeloop.com/api/auth/google/callback`

---

## Troubleshooting

### OAuth Callback Error (Redirect URI Mismatch)

**Problem:** "Error 400: redirect_uri_mismatch"

**Solution:**
1. Verify `GOOGLE_CALLBACK_URL` in Vercel matches exactly
2. Check Google Cloud Console authorized redirect URIs
3. Ensure no trailing slashes

### Database Connection Timeout

**Problem:** "MongoNetworkError: failed to connect"

**Solution:**
1. Verify MongoDB Atlas IP whitelist includes `0.0.0.0/0`
2. Check connection string username/password
3. Ensure database `challengeloop` exists

### Build Failures

**Problem:** Deployment fails during build

**Solution:**
1. Check Vercel deployment logs for specific errors
2. Verify all dependencies are in `package.json`
3. Test build locally: `npm run build`
4. Ensure `client/dist` is created after build

### API Routes Not Working

**Problem:** 404 errors on API calls

**Solution:**
1. Verify `vercel.json` routes configuration
2. Check `api/index.js` is in correct location
3. Ensure environment variables are set in Vercel

### Cron Job Not Running

**Problem:** Weekly leaderboard reset not executing

**Solution:**
- Vercel cron jobs require **Hobby** plan or higher
- Manually trigger: `curl https://your-domain.vercel.app/api/leaderboard/reset`
- Check Vercel logs for cron execution

---

## Verification Checklist

After deployment, verify:

- [ ] App loads at Vercel URL
- [ ] Google OAuth sign-in works
- [ ] Can join challenges
- [ ] Can complete check-ins
- [ ] Leaderboard displays correctly
- [ ] Activity feed shows updates
- [ ] No console errors in browser
- [ ] Environment variables are set correctly

---

## Useful Commands

```bash
# Test build locally
npm run build

# View build output
ls -la client/dist

# Check Vercel CLI (install with: npm i -g vercel)
vercel logs

# Trigger manual leaderboard reset
curl https://your-domain.vercel.app/api/leaderboard/reset

# Check API health
curl https://your-domain.vercel.app/api/health
```

---

## Resources

- [Vercel Documentation](https://vercel.com/docs)
- [MongoDB Atlas Docs](https://docs.mongodb.com/atlas/)
- [Google OAuth Docs](https://developers.google.com/identity/protocols/oauth2)
- [Express.js Docs](https://expressjs.com/)

---

**Need help?** Check the [DEPLOYMENT.md](./DEPLOYMENT.md) for more detailed troubleshooting.