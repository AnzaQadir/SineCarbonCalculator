#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Node.js backend build...');

try {
  // Check if we're in the right directory
  if (!fs.existsSync('package.json')) {
    throw new Error('package.json not found. Make sure you\'re in the backend directory.');
  }

  // Check if TypeScript is available
  console.log('📦 Checking TypeScript installation...');
  execSync('npx tsc --version', { stdio: 'inherit' });

  // Clean previous build
  console.log('🧹 Cleaning previous build...');
  if (fs.existsSync('api')) {
    // Remove only the compiled JavaScript files, not the entire directory
    execSync('find api -name "*.js" -type f -delete', { stdio: 'inherit' });
  }

  // Compile TypeScript
  console.log('🔨 Compiling TypeScript...');
  execSync('npx tsc', { stdio: 'inherit' });

  // Verify build output
  console.log('✅ Verifying build output...');
  if (!fs.existsSync('api/index.js')) {
    throw new Error('Build failed: api/index.js not found');
  }

  console.log('📋 Build contents:');
  execSync('ls -la api/', { stdio: 'inherit' });

  console.log('🎉 Backend build completed successfully!');
  process.exit(0);

} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
} 