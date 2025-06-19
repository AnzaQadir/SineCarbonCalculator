#!/bin/bash

# Carbon Calculator Simplifier - Vercel Deployment Script
echo "🚀 Carbon Calculator Simplifier - Vercel Deployment"
echo "=================================================="

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📁 Initializing git repository..."
    git init
fi

# Check if remote origin exists
if ! git remote get-url origin > /dev/null 2>&1; then
    echo "⚠️  No remote origin found!"
    echo "Please add your GitHub repository as remote origin:"
    echo "git remote add origin https://github.com/yourusername/carbon-calc-simplifier.git"
    echo ""
    echo "Then run this script again."
    exit 1
fi

# Add all files
echo "📦 Adding files to git..."
git add .

# Commit changes
echo "💾 Committing changes..."
git commit -m "Deploy to Vercel - $(date)"

# Push to GitHub
echo "⬆️  Pushing to GitHub..."
git push origin main

echo ""
echo "✅ Code pushed to GitHub successfully!"
echo ""
echo "🎯 Next Steps:"
echo "1. Go to https://vercel.com"
echo "2. Sign in with GitHub"
echo "3. Click 'New Project'"
echo "4. Import your repository"
echo "5. Configure settings:"
echo "   - Framework: Vite"
echo "   - Root Directory: frontend"
echo "   - Build Command: npm run build"
echo "   - Output Directory: dist"
echo "6. Add environment variable:"
echo "   - VITE_API_BASE_URL=https://your-app.vercel.app/api"
echo "7. Click 'Deploy'"
echo ""
echo "🌐 Your app will be live at: https://your-app.vercel.app" 