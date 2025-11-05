#!/bin/bash

# Quick Launch Script for ZERRAH Engagement Layer
# This script helps you launch both backend and frontend

echo "🚀 Launching ZERRAH Engagement Layer..."
echo ""

# Check if .env files exist
if [ ! -f "backend/.env" ]; then
  echo "⚠️  Warning: backend/.env not found"
  echo "   Make sure to set DATABASE_URL and other environment variables"
fi

if [ ! -f "frontend/.env" ] && [ ! -f "frontend/.env.local" ]; then
  echo "⚠️  Warning: frontend/.env not found"
  echo "   Make sure to set VITE_API_BASE_URL"
fi

echo "📦 Step 1: Installing dependencies..."
echo ""

# Install backend dependencies
echo "Installing backend dependencies..."
cd backend
if [ ! -d "node_modules" ]; then
  npm install
fi

# Install frontend dependencies
echo "Installing frontend dependencies..."
cd ../frontend
if [ ! -d "node_modules" ]; then
  npm install
fi

cd ..

echo ""
echo "🔨 Step 2: Building backend..."
cd backend
npm run build
cd ..

echo ""
echo "✅ Ready to launch!"
echo ""
echo "📋 Next steps:"
echo ""
echo "1. Open a terminal and run:"
echo "   cd backend && npm run dev"
echo ""
echo "2. Open another terminal and run:"
echo "   cd frontend && npm run dev"
echo ""
echo "3. Then visit:"
echo "   http://localhost:5173/login"
echo "   (Use any email, password: 1234)"
echo ""
echo "4. After login, go to:"
echo "   http://localhost:5173/dashboard"
echo ""
echo "✨ The engagement layer will be at the top of the dashboard!"
echo ""

