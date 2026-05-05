# Challengeloop - Habit + Challenge Platform

A full-stack web application for building habits through challenges. Users can create challenges, track daily check-ins, compete on leaderboards, and share progress on an activity feed.

## Tech Stack

- **Frontend**: React (Vite) with Tailwind CSS
- **Backend**: Node.js + Express
- **Database**: MongoDB with Mongoose
- **Authentication**: Google OAuth 2.0 + JWT
- **Deployment**: Vercel (frontend + serverless functions)

## Project Structure

```
challengeloop/
├── client/                   # React Vite app
├── server/                   # Express backend
├── vercel.json              # Deployment config
├── .env                     # Environment variables
└── .env.example            # Example env file
```

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
# Server dependencies
cd server
npm install

# Client dependencies
cd ../client
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and fill in:

```bash
# MongoDB Atlas connection string
MONGODB_URI=mongodb+srv://...

# Google OAuth (get from Google Cloud Console)
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# JWT secret (use a strong random string)
JWT_SECRET=your_secret_key

# URLs
CLIENT_URL=http://localhost:5173
```

### 3. Seed Database

```bash
cd server
npm run seed
```

### 4. Run Development Servers

**Terminal 1 - Backend (port 5000):**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend (port 5173):**
```bash
cd client
npm run dev
```

Visit `http://localhost:5173` in your browser.

## Features

### Authentication
- Google OAuth sign-in
- JWT token-based session
- Secure header-based auth

### Challenges
- 6 pre-seeded challenges (7, 21, and 75-day durations)
- Three difficulty modes: Easy, Medium, Hard
- Mode-specific XP rewards and completion requirements

### Check-in System
- Daily check-in tracking
- Streak counting with hard mode validation
- XP rewards (10/20/30 per check-in + completion bonuses)
- Level progression (1 level per 500 XP)

### Leaderboard
- Weekly XP-based rankings
- Top 50 global leaderboard
- User rank tracking
- Automatic weekly reset (cron job)

### Social Features
- Activity feed with latest check-ins and completions
- Like button on activities
- Comment system
- Time-ago formatting

### Badges
- 7-day challenge completion
- 21-day challenge completion
- Hard mode completion
- Perfect streak (no missed days)

## API Endpoints

### Auth
- `GET /api/auth/google` - OAuth initiation
- `GET /api/auth/google/callback` - OAuth callback
- `GET /api/auth/me` - Current user info (protected)

### Challenges
- `GET /api/challenges` - All public challenges (protected)
- `GET /api/challenges/my-challenges` - User's challenges (protected)
- `POST /api/challenges/:id/join` - Join a challenge (protected)

### Check-in
- `POST /api/checkin` - Daily check-in (protected)
- `GET /api/checkin/today-status` - Today's check-in status (protected)

### Leaderboard
- `GET /api/leaderboard/global` - Weekly leaderboard (protected)
- `GET /api/leaderboard/reset` - Reset weekly XP (cron)

### Social
- `GET /api/feed` - Activity feed (protected)
- `POST /api/feed/like` - Like an activity (protected)
- `POST /api/feed/comment` - Comment on activity (protected)

## Database Models

### User
- Google ID, name, email, avatar
- Total XP, Weekly XP, Level
- Global streak, last active date
- Badges array

### Challenge
- Title, description
- Duration (7/21/75 days)
- Base difficulty (1-3 stars)
- Created by, visibility

### UserChallenge
- User & Challenge references
- Mode (easy/medium/hard)
- Start date, completed days
- Current & longest streak
- Status (active/completed/failed/abandoned)

### Completion
- Date-specific check-in record
- XP earned
- Timestamps

### Activity
- User, type, challenge
- Metadata (day number, mode, badge)
- Likes array, comments with nested user refs

## Deployment to Vercel

1. Push to GitHub
2. Connect repo to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy (builds automatically)

The `vercel.json` config:
- Routes `/api/*` to serverless functions
- Routes `/*` to React static files
- Schedules leaderboard reset cron job

## Key Implementation Details

### Check-in Logic
The check-in endpoint handles:
1. Streak calculation (continues if yesterday's date matches)
2. XP calculation (base + completion bonus)
3. Hard mode failure detection (missed days)
4. Status updates and badge awards
5. User level recalculation
6. Global streak updates
7. Activity creation for feed

### Timezone Handling
All "today" comparisons use `YYYY-MM-DD` strings computed server-side from `new Date().toISOString().slice(0, 10)`.

### Hard Mode Enforcement
Tracks `daysSinceStart` and `expectedDays`. If user hasn't kept pace, challenge is marked failed.

## Future Enhancements

- Challenge difficulty multipliers
- Friend system and group challenges
- Push notifications
- Mobile app (React Native)
- Advanced statistics and charts
- Custom challenge creation
- Challenge templates

## License

MIT
