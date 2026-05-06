#!/bin/bash

echo "Building Challengeloop..."
echo ""

# Build api
echo "Installing api dependencies..."
cd api && npm install
echo "✓ API dependencies installed"
echo ""

# Build client
echo "Installing client dependencies..."
cd ../client && npm install
echo "✓ Client dependencies installed"
echo ""

echo "Setup complete!"
echo ""
echo "Next steps:"
echo "1. Configure .env with your MongoDB and Google OAuth credentials"
echo "2. Run: cd api && npm run seed"
echo "3. Run: npm run dev (in api directory)"
echo "4. Run: npm run dev (in client directory)"
echo ""
