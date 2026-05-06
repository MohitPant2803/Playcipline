import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import passport from 'passport';

import authRoutes from './routes/auth.js';
import challengeRoutes from './routes/challenges.js';
import checkinRoutes from './routes/checkin.js';
import leaderboardRoutes from './routes/leaderboard.js';
import feedRoutes from './routes/feed.js';
import mockDataRoutes from './routes/mockData.js';
import userRoutes from './routes/users.js';

const app = express();
const isProduction = process.env.NODE_ENV === 'production';
const mongoUri = process.env.MONGODB_URI;
let databaseReady = false;

function isDatabaseConnected() {
  return mongoose.connection.readyState === 1;
}

function requireDatabase(req, res, next) {
  if (isDatabaseConnected()) {
    return next();
  }

  return res.status(503).json({
    error: 'Database unavailable',
    message: 'MongoDB is not connected. Check MONGODB_URI and make sure MongoDB is running.'
  });
}

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173' || 'https://playcipline-client.vercel.app/',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(session({
  secret: process.env.JWT_SECRET || 'dev-secret',
  resave: false,
  saveUninitialized: true,
  cookie: { httpOnly: true }
}));
app.use(passport.initialize());
app.use(passport.session());

// Connect to MongoDB when a real URI is configured.
if (!mongoUri || mongoUri.includes('<')) {
  console.warn('MongoDB not connected: set MONGODB_URI in server/.env to enable database-backed features.');
} else {
  mongoose.connect(mongoUri)
    .then(() => {
      databaseReady = true;
      console.log('MongoDB connected');
    })
    .catch(err => {
      console.error('MongoDB connection error:', err.message);
    });
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', mockDataRoutes);
app.use('/api/challenges', requireDatabase, challengeRoutes);
app.use('/api/checkin', requireDatabase, checkinRoutes);
app.use('/api/leaderboard', requireDatabase, leaderboardRoutes);
app.use('/api/feed', requireDatabase, feedRoutes);
app.use('/api/users', requireDatabase, userRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    database: databaseReady && isDatabaseConnected() ? 'connected' : 'not_connected'
  });
});

// For Vercel serverless
export default app;

// For local development
const PORT = process.env.PORT || 5000;
if (!process.env.VERCEL) {
  const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`Port ${PORT} is already in use. Stop the existing process or set PORT to another value in server/.env.`);
      process.exit(1);
    }

    throw err;
  });
}
module.exports = app;