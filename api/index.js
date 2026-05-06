/**
 * Vercel Serverless Function Entry Point
 * This exports the Express app for Vercel to handle as a serverless function
 */

import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import passport from 'passport';

// Import routes from server directory
import authRoutes from '../server/routes/auth.js';
import challengeRoutes from '../server/routes/challenges.js';
import checkinRoutes from '../server/routes/checkin.js';
import leaderboardRoutes from '../server/routes/leaderboard.js';
import feedRoutes from '../server/routes/feed.js';
import mockDataRoutes from '../server/routes/mockData.js';
import userRoutes from '../server/routes/users.js';

const app = express();
const mongoUri = process.env.MONGODB_URI;

function isDatabaseConnected() {
  return mongoose.connection.readyState === 1;
}

// Connection caching for serverless environments to avoid reconnecting
const globalAny = global;
if (!globalAny.__mongo_cache) globalAny.__mongo_cache = { promise: null };

async function ensureMongo() {
  if (isDatabaseConnected()) return;
  if (!mongoUri || mongoUri.includes('<')) return;

  if (!globalAny.__mongo_cache.promise) {
    globalAny.__mongo_cache.promise = mongoose
      .connect(mongoUri, {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 5000
      })
      .then((client) => {
        console.log('MongoDB connected (cached)');
        return client;
      })
      .catch((err) => {
        console.error('MongoDB connection error:', err && err.message ? err.message : err);
        globalAny.__mongo_cache.promise = null;
        throw err;
      });
  }

  await globalAny.__mongo_cache.promise;
}

// Async middleware that ensures DB is connected before route handlers that need it.
async function requireDatabase(req, res, next) {
  try {
    if (!isDatabaseConnected()) {
      await ensureMongo();
    }

    if (isDatabaseConnected()) return next();

    return res.status(503).json({
      error: 'Database unavailable',
      message: 'MongoDB is not connected. Check MONGODB_URI and make sure MongoDB is running.'
    });
  } catch (err) {
    return res.status(503).json({
      error: 'Database connection failed',
      message: err && err.message ? err.message : String(err)
    });
  }
}

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(cookieParser());
const isServerless = !!process.env.VERCEL;

if (!isServerless) {
  app.use(session({
    secret: process.env.JWT_SECRET || 'dev-secret',
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none'
    }
  }));
  app.use(passport.initialize());
  app.use(passport.session());
} else {
  app.use(passport.initialize());
  console.warn('Running in Vercel serverless mode: express-session skipped. Use JWT or external session store for persistent sessions.');
}

// Note: connections are established lazily via `ensureMongo()` to support serverless environments.
if (!mongoUri || mongoUri.includes('<')) {
  console.warn('MongoDB not connected: set MONGODB_URI to enable database-backed features.');
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
    database: isDatabaseConnected() ? 'connected' : 'not_connected'
  });
});

// Vercel serverless export
export default app;