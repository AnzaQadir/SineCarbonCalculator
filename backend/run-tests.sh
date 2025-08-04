#!/bin/bash

# Personality API Test Runner
# This script runs comprehensive tests for the /calculatePersonality API endpoint

echo "🧪 Personality API Test Runner"
echo "================================"

# Check if API server is running
echo "🔍 Checking if API server is running..."
if curl -s http://localhost:3000/api/health > /dev/null 2>&1; then
    echo "✅ API server is running on http://localhost:3000"
else
    echo "❌ API server is not running on http://localhost:3000"
    echo "Please start the server first: npm run dev"
    exit 1
fi

# Install dependencies if needed
echo "📦 Checking dependencies..."
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Run the tests
echo "🚀 Running personality API tests..."
echo ""

# Run tests with verbose output
npm run test:personality

# Check test results
if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 All tests passed!"
    echo ""
    echo "📊 Test Summary:"
    echo "   ✅ Personality archetype determination"
    echo "   ✅ Comprehensive power moves generation"
    echo "   ✅ Hook lines and descriptions"
    echo "   ✅ Error handling"
    echo "   ✅ Performance validation"
    echo "   ✅ Data structure validation"
    echo ""
    echo "✨ API is functioning correctly!"
else
    echo ""
    echo "❌ Some tests failed!"
    echo "Please check the output above for details."
    exit 1
fi 