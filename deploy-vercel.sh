#!/bin/bash

# ============================================================
# Streakify - Vercel Deployment Script
# ============================================================
# This script helps you deploy to Vercel with all proper
# configuration and environment variables

set -e

echo "🚀 Streakify - Vercel Deployment Helper"
echo "============================================"
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📥 Installing Vercel CLI..."
    npm install -g vercel
fi

echo "✅ Vercel CLI is installed"
echo ""

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Error: Not a git repository. Please run 'git init' first."
    exit 1
fi

echo "📋 Pre-deployment checklist:"
echo "  1. Have you set up MongoDB Atlas? (https://www.mongodb.com/cloud/atlas)"
echo "  2. Have you created Google OAuth credentials? (https://console.cloud.google.com/)"
echo "  3. Have you committed all changes to git?"
echo ""

read -p "Are you ready to deploy? (yes/no): " ready

if [ "$ready" != "yes" ]; then
    echo "❌ Deployment cancelled"
    exit 1
fi

echo ""
echo "🔍 Checking project structure..."

if [ ! -f "vercel.json" ]; then
    echo "❌ vercel.json not found!"
    exit 1
fi

if [ ! -d "api" ] || [ ! -d "client" ]; then
    echo "❌ api/ or client/ directory not found!"
    exit 1
fi

echo "✅ Project structure is valid"
echo ""

# Commit any uncommitted changes
if git status --porcelain | grep -q "^[^ ]"; then
    echo "📝 You have uncommitted changes"
    read -p "Commit and deploy? (yes/no): " commit_ok
    
    if [ "$commit_ok" = "yes" ]; then
        git add .
        read -p "Enter commit message: " commit_msg
        git commit -m "$commit_msg"
        git push origin main
    fi
fi

echo ""
echo "🌐 Starting Vercel deployment..."
echo ""

# Deploy to Vercel
vercel --prod

echo ""
echo "✅ Deployment initiated!"
echo ""
echo "📋 Next steps:"
echo "  1. Wait for deployment to complete on vercel.com"
echo "  2. Go to Project Settings → Environment Variables"
echo "  3. Add the following environment variables:"
echo ""
echo "     MONGODB_URI=mongodb+srv://username:password@..."
echo "     GOOGLE_CLIENT_ID=your-client-id"
echo "     GOOGLE_CLIENT_SECRET=your-secret"
echo "     JWT_SECRET=your-random-secret"
echo "     CLIENT_URL=https://your-app.vercel.app"
echo "     NODE_ENV=production"
echo ""
echo "  4. Redeploy by going to Deployments and clicking 'Redeploy'"
echo ""
echo "🔗 Your app will be available at: https://your-app.vercel.app"
echo ""
echo "📚 For detailed instructions, see: VERCEL_DEPLOYMENT_COMPLETE.md"
echo ""
