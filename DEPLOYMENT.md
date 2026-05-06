# Challengeloop Deployment Guide

## Prerequisites

- GitHub account
- Vercel account (free tier available at vercel.com)
- MongoDB Atlas account (free tier available at mongodb.com)
- Google Cloud Console account (for OAuth)

## Step 1: MongoDB Setup

### Create MongoDB Atlas Cluster

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new project: "Challengeloop"
4. Create a cluster (M0 free tier)
5. Wait for cluster to deploy (~3-5 minutes)

### Create Database Credentials

1. In your cluster, go to "Security" > "Database Access"
2. Add a new database user:
   - Username: `challengeloop`
   - Password: Generate a secure password
   - Built-in Roles: "Atlas admin"
3. Click "Add User"

### Whitelist IP Addresses

1. Go to "Security" > "Network Access"
2. Click "Add IP Address"
3. Add "0.0.0.0/0" (allows all IPs - for development)
   - For production, use your Vercel IP ranges

### Get Connection String

1. Go to "Clusters" and click "Connect"
2. Choose "Drivers"
3. Select "Node.js"
4. Copy the connection string
5. Replace `<username>` and `<password>` with your credentials
6. Replace `<dbname>` with `challengeloop`

Example:
```
mongodb+srv://challengeloop:PASSWORD@cluster0.xxxxx.mongodb.net/challengeloop?retryWrites=true&w=majority
```

## Step 2: Google OAuth Setup

### Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project: "Challengeloop"
3. Enable "Google+ API":
   - Search for "Google+ API"
   - Click "Enable"

### Create OAuth Credentials

1. Go to "Credentials"
2. Click "Create Credentials" > "OAuth client ID"
3. Choose "Web application"
4. Add Authorized JavaScript origins:
   - `http://localhost:5000` (development)
   - `http://localhost:5173` (development)
   - `https://yourdomain.vercel.app` (production)
5. Add Authorized redirect URIs:
   - `http://localhost:5000/api/auth/google/callback` (development)
   - `https://yourdomain.vercel.app/api/auth/google/callback` (production)
6. Copy your:
   - Client ID
   - Client Secret

## Step 3: Local Development Setup

### Clone and Install

```bash
git clone <your-repo-url>
cd challengeloop

# Install dependencies
cd api && npm install
cd ../client && npm install
```

### Configure Environment Variables

Create `.env` file in project root:

```env
MONGODB_URI=mongodb+srv://challengeloop:PASSWORD@cluster0.xxxxx.mongodb.net/challengeloop?retryWrites=true&w=majority
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
JWT_SECRET=your_super_secret_key_here_minimum_32_chars
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### Seed Database

```bash
cd api
npm run seed
```

### Run Development Servers

**Terminal 1:**
```bash
cd api
npm run dev
```

**Terminal 2:**
```bash
cd client
npm run dev
```

Visit `http://localhost:5173` and test the Google OAuth login.

## Step 4: Prepare for Vercel Deployment

### Update package.json Scripts

**api/package.json** - add build script:
```json
"scripts": {
  "build": "npm install",
  "dev": "nodemon index.js",
  "start": "node index.js",
  "seed": "node scripts/seed.js"
}
```

**client/package.json** - already has build script:
```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview"
}
```

### Create Root package.json

Create `package.json` in project root:

```json
{
  "name": "challengeloop",
  "version": "1.0.0",
  "workspaces": ["api", "client"],
  "scripts": {
    "dev": "concurrently \"npm run dev --workspace=api\" \"npm run dev --workspace=client\"",
    "build": "npm run build --workspace=api && npm run build --workspace=client"
  }
}
```

### Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit: Challengeloop full-stack app"
git branch -M main
git remote add origin https://github.com/yourusername/challengeloop.git
git push -u origin main
```

## Step 5: Deploy to Vercel

### Connect GitHub Repository

1. Go to [Vercel](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Select "Other" as the framework
5. Click "Deploy"

### Configure Environment Variables

1. Go to project settings
2. Click "Environment Variables"
3. Add all variables from `.env`:
   - `MONGODB_URI`
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `GOOGLE_CALLBACK_URL` (update to production domain)
   - `JWT_SECRET`
   - `CLIENT_URL` (update to production domain)
   - `NODE_ENV=production`

### Update vercel.json

The `vercel.json` file already has the correct configuration for:
- API routes
- Static files
- Leaderboard reset cron job

### Custom Domain (Optional)

1. In Vercel project settings, go to "Domains"
2. Add your custom domain
3. Update DNS records according to Vercel's instructions
4. Update OAuth redirect URLs in Google Cloud Console

## Step 6: Post-Deployment

### Update Google OAuth

1. Go back to Google Cloud Console
2. Update OAuth credentials with production domain:
   - Add `https://your-production-domain.vercel.app` to authorized origins
   - Add `https://your-production-domain.vercel.app/api/auth/google/callback` to redirect URIs

### Seed Production Database

The first time the server deploys, it will automatically seed challenges if the collection is empty. For manual seeding:

1. SSH into a server instance or use MongoDB Atlas web interface
2. Run the seed script or insert documents manually

### Verify Deployment

1. Visit your production URL
2. Test Google OAuth sign-in
3. Complete a check-in to verify the backend
4. Check leaderboard functionality

## Troubleshooting

### OAuth Callback Error

**Problem:** Redirect URI mismatch
**Solution:** Ensure `GOOGLE_CALLBACK_URL` and OAuth redirect URIs in Google Cloud Console match exactly

### Database Connection Error

**Problem:** MongoDB connection timeout
**Solution:** 
- Verify MongoDB Atlas IP whitelist includes your IP
- Check connection string has correct username/password
- Ensure database exists with correct name

### Cron Job Not Running

**Problem:** Leaderboard reset not running on schedule
**Solution:**
- Vercel crons require "Standard" plan or higher
- Check Vercel logs for cron execution
- Manually trigger: `curl https://your-domain.vercel.app/api/leaderboard/reset`

### Build Failures

**Problem:** Deployment fails during build
**Solution:**
- Check Vercel build logs
- Ensure all dependencies are in package.json
- Verify environment variables are set
- Test locally before pushing

## Performance Optimization

### Recommended Vercel Settings

1. **Build Command:** `npm run build`
2. **Output Directory:** `client/dist`
3. **Install Command:** `npm install`

### Database Optimization

1. Create indexes on frequently queried fields:
   ```javascript
   // In MongoDB Atlas
   db.users.createIndex({ "email": 1 });
   db.users.createIndex({ "weeklyXP": -1 });
   db.userchallenges.createIndex({ "userId": 1, "status": 1 });
   ```

## Monitoring

### Vercel Analytics

1. Enable Analytics in Vercel settings
2. Monitor performance metrics
3. Set up alerts for high error rates

### MongoDB Monitoring

1. Use MongoDB Atlas Performance Advisor
2. Monitor connection pool usage
3. Set up alerts for CPU and memory

## Security Checklist

- [ ] Change `JWT_SECRET` to a strong random string
- [ ] Enable HTTPS (automatic on Vercel)
- [ ] Restrict MongoDB IP whitelist for production
- [ ] Use environment variables for all secrets
- [ ] Enable 2FA on MongoDB Atlas
- [ ] Enable 2FA on Google Cloud Console
- [ ] Set up CORS properly for production domain
- [ ] Regular backups of MongoDB
- [ ] Monitor for suspicious activity

## Maintenance

### Weekly

- Check Vercel deployment logs
- Review MongoDB performance metrics
- Monitor error rates in analytics

### Monthly

- Update dependencies: `npm outdated`
- Review security advisories: `npm audit`
- Test backup/restore procedures
- Review user feedback and logs

### Quarterly

- Performance optimization review
- Database optimization
- Security audit

## Scaling

When ready to scale:

1. **Database:** Upgrade MongoDB Atlas cluster (M1 or higher)
2. **Frontend:** Already on Vercel's global CDN
3. **Backend:** Vercel auto-scales functions
4. **Caching:** Add Redis for session/cache layer
5. **API:** Implement rate limiting and pagination

## Support

For issues:
1. Check Vercel docs: https://vercel.com/docs
2. Check MongoDB docs: https://docs.mongodb.com
3. Check Express docs: https://expressjs.com
4. Check React docs: https://react.dev
