# Challengeloop Quick Start Guide

## 5-Minute Setup (Local Development)

### Prerequisites
- Node.js 16+ installed
- MongoDB Atlas account (free tier)
- Google Cloud Console OAuth credentials

### Step 1: Configure Environment Variables

Create `.env` in project root:

```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/challengeloop?retryWrites=true&w=majority
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
JWT_SECRET=any_random_string_here_minimum_32_characters
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### Step 2: Install Dependencies

```bash
cd server && npm install
cd ../client && npm install
```

### Step 3: Seed Database

```bash
cd server
npm run seed
```

You should see: ✓ Seeded challenges successfully

### Step 4: Run Servers

**Terminal 1:**
```bash
cd server
npm run dev
```

Expected output:
```
MongoDB connected
Server running on port 5000
```

**Terminal 2:**
```bash
cd client
npm run dev
```

Expected output:
```
VITE v4.x.x ready in xxx ms
➜ Local: http://localhost:5173/
```

### Step 5: Test the App

1. Open http://localhost:5173
2. Click "Sign in with Google"
3. Complete OAuth flow
4. You should be redirected to Dashboard
5. Try exploring challenges and check-ins

## Quick Test Flows

### Test Check-in Flow
1. Go to Explore
2. Join any challenge with any mode
3. Go to Dashboard
4. Click "Complete Day"
5. Should show toast "+10 XP" (or 20/30)
6. Verify streak increments

### Test Leaderboard
1. Complete a few check-ins
2. Go to Leaderboard
3. Should show your name with weekly XP
4. Rank increases as you gain more XP

### Test Feed
1. After completing check-in
2. Go to Feed
3. Should see your activity
4. Try liking and commenting

## Troubleshooting Quick Fixes

### OAuth Fails
- Check `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`
- Verify `GOOGLE_CALLBACK_URL` matches Google Cloud Console

### MongoDB Connection Error
- Verify `MONGODB_URI` is correct
- Check IP whitelist in MongoDB Atlas (add 0.0.0.0/0)
- Ensure database user is created

### Port Already in Use
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Kill process on port 5173
lsof -ti:5173 | xargs kill -9
```

### Dependency Issues
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Key Files to Know

- **Backend Entry:** `server/index.js`
- **Frontend Entry:** `client/src/main.jsx`
- **Check-in Logic:** `server/routes/checkin.js` (most complex)
- **Auth Context:** `client/src/context/AuthContext.jsx`
- **Dashboard:** `client/src/pages/Dashboard.jsx`

## Common Commands

```bash
# Seed database with challenges
npm run seed --workspace=server

# Run development servers
npm run dev

# Build for production
npm run build

# Check API health
curl http://localhost:5000/api/health

# View logs (if using PM2)
pm2 logs
```

## Next Steps

1. **Customize:** Edit seed challenges in `server/scripts/seed.js`
2. **Styling:** Modify Tailwind config in `client/tailwind.config.js`
3. **Features:** Add features by extending routes & components
4. **Deploy:** Follow [DEPLOYMENT.md](./DEPLOYMENT.md)

## Project Structure Summary

```
challengeloop/
├── server/              # Node.js + Express backend
│   ├── models/         # Mongoose schemas (5 models)
│   ├── routes/         # Express routers (5 routers)
│   ├── middleware/     # JWT verification
│   ├── scripts/        # Database seeding
│   └── index.js        # App entry point
│
├── client/              # React + Vite frontend
│   ├── src/
│   │   ├── pages/      # 6 pages (Login, Dashboard, etc.)
│   │   ├── components/ # Reusable UI components
│   │   ├── context/    # Auth & User context
│   │   ├── api/        # Axios client
│   │   ├── hooks/      # Custom hooks
│   │   └── App.jsx     # Router & layout
│   ├── vite.config.js  # Vite configuration
│   └── tailwind.config.js
│
├── .env                 # Environment variables
├── vercel.json         # Deployment config
├── README.md           # Full documentation
├── DEPLOYMENT.md       # Vercel deployment guide
├── ARCHITECTURE.md     # Technical deep dive
└── QUICKSTART.md       # This file
```

## Support & Resources

- **Express Docs:** https://expressjs.com
- **React Docs:** https://react.dev
- **Mongoose Docs:** https://mongoosejs.com
- **Vite Docs:** https://vitejs.dev
- **Vercel Docs:** https://vercel.com/docs

## Performance Tips

1. **Frontend:** Images in `client/public/` are cached
2. **Backend:** Use `.lean()` on find() queries
3. **Database:** Index frequently queried fields
4. **Deployment:** Use Vercel Pro for better performance

## Security Notes

- Never commit `.env` to Git
- Use strong `JWT_SECRET`
- Rotate secrets periodically
- Keep dependencies updated

## Feature Overview

✅ Google OAuth authentication
✅ Challenge system (7/21/75 days)
✅ Three difficulty modes (Easy/Medium/Hard)
✅ Daily check-in tracking
✅ Streak counting & global streak
✅ XP system & level progression
✅ Badge awards
✅ Weekly XP leaderboard
✅ Activity feed with likes & comments
✅ User profiles & statistics

## Ready to Deploy?

See [DEPLOYMENT.md](./DEPLOYMENT.md) for production setup.

Happy building! 🚀
