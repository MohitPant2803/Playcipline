# Vercel Deployment Checklist

## Setup Instructions

### 1. Environment Variables
Set these in your Vercel project settings (Settings → Environment Variables):

- `MONGODB_URI` - Your MongoDB connection string (use MongoDB Atlas for production)
- `GOOGLE_CLIENT_ID` - From Google OAuth console
- `GOOGLE_CLIENT_SECRET` - From Google OAuth console  
- `GOOGLE_CALLBACK_URL` - Should be `https://your-domain.vercel.app/api/auth/google/callback`
- `JWT_SECRET` - A long random string for token signing
- `CLIENT_URL` - Should be `https://your-domain.vercel.app`
- `NODE_ENV` - Set to `production`

### 2. Project Structure
- ✅ `/api/index.js` - Serverless function entry point
- ✅ `/client/` - Static frontend (builds to `/client/dist`)
- ✅ `/server/` - Backend routes and models
- ✅ `vercel.json` - Deployment configuration

### 3. Deployment Steps

1. Push your code to GitHub
2. Create a new project on [Vercel](https://vercel.com)
3. Select your repository
4. Set the framework to "Other" 
5. Under "Build and Output Settings":
   - Build Command: `npm run build:vercel`
   - Output Directory: `client/dist`
   - Install Command: `npm install`
6. Add environment variables (from step 1)
7. Deploy

### 4. Google OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable "Google+ API"
4. Create OAuth 2.0 credentials (Web Application)
5. Add authorized redirect URIs:
   - Local: `http://localhost:5000/api/auth/google/callback`
   - Production: `https://your-domain.vercel.app/api/auth/google/callback`

### 5. MongoDB Atlas Setup
1. Create an account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Set up database user credentials
4. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/challengeloop`
5. Use this as your `MONGODB_URI`

### 6. Testing Deployment
```bash
# Test locally first
npm run dev

# Build for production
npm run build:vercel

# Verify the build output
ls -la client/dist
```

## Troubleshooting

### Build Fails
- Check that all dependencies are in `package.json` files
- Ensure Node modules are properly installed
- Review Vercel build logs

### API Calls Fail
- Verify `MONGODB_URI` is correct
- Check that `CLIENT_URL` matches your domain
- Ensure CORS origins are properly configured

### Database Connection Issues
- Use MongoDB Atlas (supports serverless functions)
- Local MongoDB won't work in production
- Test connection with health check: `GET /api/health`

## Next Steps
- Set up CI/CD with GitHub Actions (optional)
- Configure custom domain in Vercel
- Set up monitoring and logging
