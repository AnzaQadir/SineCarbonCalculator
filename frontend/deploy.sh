#!/bin/bash

# Vercel Frontend Deployment Script

echo "🚀 Starting Vercel deployment..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the project
echo "🔨 Building the project..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo "📁 Build output in dist/ directory"
    
    # List build output
    echo "📋 Build contents:"
    ls -la dist/
else
    echo "❌ Build failed!"
    exit 1
fi

echo "🎉 Deployment script completed!" 