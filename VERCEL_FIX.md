# Vercel Deployment Fix - "No Output Directory named dist" Error

## Problem
Vercel is showing the error: "No Output Directory named 'dist' found after the Build completed."

## Root Cause
This error typically occurs when Vercel's **Root Directory** setting is misconfigured. The Root Directory determines where Vercel runs the build command from.

## Solution

### Step 1: Check Vercel Root Directory Setting

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **General**
3. Look for **Root Directory**
4. **Important**: This should be **empty** (not set to `client` or any other directory)

If the Root Directory is set to `client`, Vercel will:
- Run the build from inside the `client/` directory
- Look for `dist` in the current directory (which would be `client/dist`)
- But the outputDirectory in vercel.json is set to `client/dist` relative to the project root
- This creates a path mismatch

**Fix**: Clear the Root Directory field (make it empty) and save.

### Step 2: Verify Build and Output Settings

After fixing the Root Directory, verify these settings in **Settings** → **Build & Development Settings**:

- **Build Command**: `npm run build`
- **Output Directory**: `client/dist`
- **Install Command**: `npm install`

These should match your `vercel.json` configuration.

### Step 3: Alternative Solution - Use Root Directory = client

If you prefer to set the Root Directory to `client`, you need to adjust your configuration:

1. Set **Root Directory** to `client`
2. Update **Build Command** to: `npm run build` (this will run from client directory)
3. Update **Output Directory** to: `dist` (not `client/dist`)
4. Update `vercel.json`:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "functions": {
    "api/*.js": {
      "memory": 1024,
      "maxDuration": 30
    }
  },
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/api/index.js" },
    { "source": "/(.*)", "destination": "/index.html" }
  ],
  "crons": [
    {
      "path": "/api/leaderboard/reset",
      "schedule": "0 0 * * 0"
    }
  ]
}
```

**Note**: When Root Directory is set to `client`, Vercel will run all commands from the `client/` directory, so the build output will be `client/dist` which is just `dist` relative to the current working directory.

### Step 4: Check Build Logs

After making changes, check the Vercel deployment logs:

1. Go to **Deployments** tab
2. Click on the latest deployment
3. View the build logs
4. Look for:
   - Build command execution
   - Any errors during build
   - Output directory creation confirmation

### Step 5: Test Locally

Before deploying, test the build locally:

```bash
# Clean previous builds
rm -rf client/dist

# Run build
npm run build

# Verify output
ls -la client/dist
```

You should see:
```
client/dist/
├── index.html
└── assets/
    ├── index-xxxxx.css
    └── index-xxxxx.js
```

## Changes Made

I've already updated your `vercel.json` to fix the rewrites configuration:

**Before:**
```json
{ "source": "/(.*)", "destination": "/client/dist/index.html" }
```

**After:**
```json
{ "source": "/(.*)", "destination": "/index.html" }
```

**Reason**: Since `outputDirectory` is set to `client/dist`, the files are already at the root of the output directory. The destination should be `/index.html`, not `/client/dist/index.html`.

## Recommended Configuration

For your monorepo structure, I recommend:

**Option A (Recommended)**: Keep Root Directory empty
- Root Directory: *(empty)*
- Build Command: `npm run build`
- Output Directory: `client/dist`
- Install Command: `npm install`

**Option B**: Set Root Directory to client
- Root Directory: `client`
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

## Troubleshooting Checklist

- [ ] Root Directory is empty (or set to `client` with adjusted config)
- [ ] Build Command is `npm run build`
- [ ] Output Directory is `client/dist` (or `dist` if Root Directory = client)
- [ ] Install Command is `npm install`
- [ ] `vercel.json` rewrites point to `/index.html` (not `/client/dist/index.html`)
- [ ] Environment variables are set correctly in Vercel
- [ ] Build completes successfully in local environment

## Quick Fix Steps

1. **Go to Vercel Dashboard** → Your Project → **Settings** → **General**
2. **Clear the Root Directory field** (make sure it's empty)
3. **Save** the changes
4. **Go to Deployments** → **Redeploy** the latest deployment
5. **Check the logs** to verify the build completes and output directory is found

This should resolve the "No Output Directory named 'dist'" error.