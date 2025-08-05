#!/bin/bash

# Vercel Backend Deployment Script

echo "🚀 Starting Vercel backend deployment..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the project
echo "🔨 Building the project..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo "📁 Build output in api/ directory"
    
    # List build output
    echo "📋 Build contents:"
    ls -la api/
else
    echo "❌ Build failed!"
    exit 1
fi

echo "🎉 Backend deployment script completed!" 