# ✅ Pre-Deployment Verification Checklist

Before pushing to Vercel, verify all these items are complete:

## Configuration Files
- [x] **vercel.json** exists with correct settings
  - [ ] `buildCommand`: `npm run build`
  - [ ] `outputDirectory`: `client/dist`
  - [ ] `functions`: points to `api.js`
  - [ ] `rewrites`: includes `/(.*) → /index.html`
  
- [x] **api.js** wrapper exists at root level
  - [ ] Exports default app from `./api/index.js`

- [x] **package.json** (root) has correct scripts
  - [ ] `build` script calls `npm run build --workspace=client`
  - [ ] `dev` script uses concurrently for both servers

- [x] **client/vite.config.js** configured for production
  - [ ] Build settings include minify and rollupOptions

## Code Updates
- [x] **api/index.js** has production-ready CORS
  - [ ] Accepts `ALLOWED_ORIGINS` environment variable
  - [ ] Falls back to `CLIENT_URL`

- [x] **client/src/api/client.js** has error logging
  - [ ] Console logs API errors with base URL
  - [ ] 10-second timeout set

- [x] **client/index.html** has correct entry point
  - [ ] `<div id="root"></div>` exists
  - [ ] Loads `/src/main.jsx`

## Environment Variables (Set in Vercel Dashboard)
- [ ] `MONGODB_URI` - MongoDB Atlas connection string
- [ ] `GOOGLE_CLIENT_ID` - From Google Cloud Console
- [ ] `GOOGLE_CLIENT_SECRET` - From Google Cloud Console
- [ ] `JWT_SECRET` - Strong random string (32+ characters)
- [ ] `CLIENT_URL` - Your Vercel app domain
- [ ] `NODE_ENV` - Set to `production`

## Git & Deployment
- [ ] All changes committed to git
- [ ] Pushed to GitHub (main branch)
- [ ] GitHub connection set up in Vercel
- [ ] Vercel project created and linked to repo

## Pre-Deployment Local Testing
```bash
# Test build locally
npm run build
ls -la client/dist/

# Verify it contains:
# ✓ index.html
# ✓ assets/ directory
# ✓ NOT just showing index.js
```

- [ ] Build completes without errors
- [ ] Output is in `client/dist/` directory
- [ ] Client can connect to API locally at `http://localhost:5000`

## Vercel Dashboard Setup
- [ ] Project connected to GitHub
- [ ] Vercel automatically detected monorepo
- [ ] Build command shows: `npm run build`
- [ ] Output directory shows: `client/dist`
- [ ] Node version is 18.x or higher

## After Deployment
- [ ] Visit `https://your-app.vercel.app`
  - [ ] Page loads (no white screen)
  - [ ] Login page shows
  - [ ] No JavaScript errors in console (F12)

- [ ] Check API health: `https://your-app.vercel.app/api/health`
  - [ ] Returns `{"status":"ok","database":"connected"}`

- [ ] Test authentication flow
  - [ ] Can click "Login with Google"
  - [ ] Get redirected back to app
  - [ ] Can see dashboard

- [ ] Check browser console (F12) for errors
  - [ ] No CORS errors
  - [ ] No 404 errors
  - [ ] No undefined references

## If You See Issues

### White Screen
```
1. Check browser console (F12)
2. Clear cache: Ctrl+Shift+Delete
3. Verify vercel.json outputDirectory
4. Check Vercel build logs
```

### API Errors (504, 503)
```
1. Check MONGODB_URI is set
2. Verify MongoDB Atlas network access
3. Run: vercel logs --follow
4. Check API health endpoint
```

### CORS Errors
```
1. Verify CLIENT_URL matches your domain
2. Check ALLOWED_ORIGINS environment variable
3. Verify api.js is properly exported
4. Check browser DevTools Network tab
```

### Routes Not Working (404 on page refresh)
```
1. Check vercel.json rewrites section
2. Verify outputDirectory is client/dist
3. Check that index.html exists in dist/
4. Vercel needs to redeploy after config change
```

## Rollback Instructions
If deployment fails:
```bash
# View deployment history
vercel deployments list

# Rollback to previous
vercel rollback <deployment-id>

# Or redeploy:
vercel --prod
```

---

**Ready?** When all items above are checked, you're good to deploy! 🚀

For step-by-step instructions, see: `VERCEL_DEPLOYMENT_COMPLETE.md`
