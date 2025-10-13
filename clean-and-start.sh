#!/bin/bash
# Clean and Start Development Server
# Run this script if you encounter EPERM errors

echo "🧹 Cleaning up..."

# Stop all Node processes
echo "Stopping Node processes..."
taskkill //F //IM node.exe //T 2>/dev/null || true

# Wait for processes to fully terminate
sleep 2

# Remove .next directory
if [ -d ".next" ]; then
    echo "Removing .next directory..."
    rm -rf .next 2>/dev/null || cmd //c "rd /s /q .next" 2>/dev/null || true
fi

# Remove node_modules/.cache
if [ -d "node_modules/.cache" ]; then
    echo "Removing node_modules cache..."
    rm -rf node_modules/.cache 2>/dev/null || true
fi

echo "✅ Cleanup complete!"
echo ""
echo "🚀 Starting development server..."

# Start dev server
npm run dev

