#!/bin/bash
set -e

echo "=== Building Clarity Finance Tracker ==="

# Step 1: Build the React frontend
echo "--- Installing frontend dependencies..."
cd "$(dirname "$0")/../frontend"
npm install

echo "--- Building React app..."
npm run build

# Step 2: Copy build output to backend
echo "--- Copying build to backend..."
cp -r build ../backend/build

# Step 3: Install backend dependencies
echo "--- Installing backend dependencies..."
cd ../backend
npm install

echo "=== Build complete ==="
