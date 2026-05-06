# ============================================================
# VERCEL DEPLOYMENT - ENVIRONMENT VARIABLES SETUP
# ============================================================
# Copy and paste these into Vercel Dashboard:
# Project Settings → Environment Variables

# STEP 1: Copy the variables below
# STEP 2: Replace values with your actual credentials
# STEP 3: Paste into Vercel dashboard for each environment (Production, Preview, Development)

# ============================================================
# DATABASE - MongoDB Atlas
# ============================================================
# Get from: https://www.mongodb.com/cloud/atlas
# Connection string format:
# mongodb+srv://username:password@clustername.mongodb.net/databasename
MONGODB_URI=mongodb+srv://your-username:your-password@cluster0.xxxxx.mongodb.net/challengeloop?retryWrites=true&w=majority

# ============================================================
# AUTHENTICATION - Google OAuth 2.0
# ============================================================
# Get from: https://console.cloud.google.com/
# Steps:
# 1. Create OAuth 2.0 Client ID (Web application)
# 2. Add authorized JavaScript origins:
#    - https://your-app.vercel.app
#    - http://localhost:5173 (dev)
# 3. Add authorized redirect URIs:
#    - https://your-app.vercel.app/api/auth/google/callback
#    - http://localhost:5000/api/auth/google/callback (dev)

GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret-key

# ============================================================
# SECURITY - JWT Secret
# ============================================================
# Generate a long random string:
# Option 1: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
# Option 2: openssl rand -hex 32
# Keep it SECRET and the same across all deployments

JWT_SECRET=your-long-random-jwt-secret-at-least-32-characters

# ============================================================
# URLS - CORS and Client Configuration
# ============================================================
# Replace with your actual Vercel app URL
CLIENT_URL=https://your-app-name.vercel.app
ALLOWED_ORIGINS=https://your-app-name.vercel.app

# Optional: Custom API base URL
# Only set if API is on separate domain
# VITE_API_BASE_URL=https://api.your-domain.com

# ============================================================
# NODE ENVIRONMENT
# ============================================================
NODE_ENV=production

# ============================================================
# OPTIONAL: Development/Testing Variables
# ============================================================
# Only set these if you need local development
# VITE_API_TARGET=http://localhost:5000

# ============================================================
# DEPLOYMENT INSTRUCTIONS
# ============================================================
#
# 1. Go to https://vercel.com and sign in
# 2. Select your project
# 3. Go to "Settings" → "Environment Variables"
# 4. For each variable above (except comments):
#    - Variable name: Copy the key (e.g., MONGODB_URI)
#    - Value: Copy your actual value
#    - Environment: Select "Production" (or all if same for all)
#    - Click "Save"
#
# 5. After adding all variables, redeploy:
#    - Go to "Deployments"
#    - Click the "..." menu on latest deployment
#    - Select "Redeploy"
#
# 6. Verify deployment:
#    - Client: https://your-app-name.vercel.app (should show login page)
#    - API: https://your-app-name.vercel.app/api/health (should return {"status":"ok"})
#
# ============================================================
# TROUBLESHOOTING
# ============================================================
#
# White screen on client?
# - Check browser DevTools console (F12) for errors
# - Clear cache: Ctrl+Shift+Delete
# - Verify VITE_API_BASE_URL if using custom domain
#
# API returns 404?
# - Verify MONGODB_URI environment variable is set
# - Check Vercel logs: vercel logs --follow
# - Ensure database network access is enabled
#
# CORS/Auth errors?
# - Verify CLIENT_URL matches your Vercel domain
# - Add domain to Google OAuth authorized origins
# - Check ALLOWED_ORIGINS in environment variables
#
# ============================================================
