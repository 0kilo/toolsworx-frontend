#!/bin/bash

echo "🚀 Starting TOOLS WORX backend services (simple mode)..."

# Install dependencies if needed
cd backend/file-conversion-service
if [ ! -d "node_modules" ]; then
    echo "📦 Installing file-conversion-service dependencies..."
    npm install express cors multer
fi

cd ../media-conversion-service
if [ ! -d "node_modules" ]; then
    echo "📦 Installing media-conversion-service dependencies..."
    npm install express cors multer
fi

cd ../filter-service
if [ ! -d "node_modules" ]; then
    echo "📦 Installing filter-service dependencies..."
    npm install express cors multer
fi

cd ../..

# Start services in background
echo "🔧 Starting File Conversion Service on port 3000..."
cd backend/file-conversion-service
node src/simple-server.js &
FILE_PID=$!

echo "🎬 Starting Media Conversion Service on port 3001..."
cd ../media-conversion-service
node src/simple-server.js &
MEDIA_PID=$!

echo "🎨 Starting Filter Service on port 3002..."
cd ../filter-service
node src/simple-server.js &
FILTER_PID=$!

cd ../..

# Save PIDs for cleanup
echo $FILE_PID > /tmp/file-service.pid
echo $MEDIA_PID > /tmp/media-service.pid
echo $FILTER_PID > /tmp/filter-service.pid

echo ""
echo "✅ Backend services started!"
echo "📋 Services:"
echo "  - File Conversion: http://localhost:3000/health"
echo "  - Media Conversion: http://localhost:3001/health" 
echo "  - Filter Service: http://localhost:3002/health"
echo "  - Redis: localhost:6379 (already running)"
echo ""
echo "🛑 To stop services: ./scripts/stop-backend-simple.sh"
echo ""

# Wait a moment for services to start
sleep 3

# Test services
echo "🧪 Testing services..."
curl -s http://localhost:3000/health | grep -q "healthy" && echo "✅ File Conversion Service: OK" || echo "❌ File Conversion Service: Failed"
curl -s http://localhost:3001/health | grep -q "healthy" && echo "✅ Media Conversion Service: OK" || echo "❌ Media Conversion Service: Failed"  
curl -s http://localhost:3002/health | grep -q "healthy" && echo "✅ Filter Service: OK" || echo "❌ Filter Service: Failed"