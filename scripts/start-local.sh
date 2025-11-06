#!/bin/bash

# Start local development environment
echo "🚀 Starting TOOLS WORX local development environment..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Navigate to backend directory
cd backend

# Build and start backend services
echo "📦 Building and starting backend services..."
docker-compose up --build -d

# Wait for services to be healthy
echo "⏳ Waiting for services to be ready..."
sleep 10

# Check service health
echo "🔍 Checking service health..."
for service in redis file-conversion media-conversion filter-service; do
    if docker-compose ps $service | grep -q "Up"; then
        echo "✅ $service is running"
    else
        echo "❌ $service failed to start"
        docker-compose logs $service
    fi
done

# Navigate back to root
cd ..

# Start frontend in development mode
echo "🎨 Starting frontend development server..."
echo "Frontend will be available at: http://localhost:3001"
echo "Backend services:"
echo "  - File Conversion: http://localhost:3000"
echo "  - Media Conversion: http://localhost:3001" 
echo "  - Filter Service: http://localhost:3002"
echo "  - Redis: localhost:6379"
echo ""
echo "To stop services: ./scripts/stop-local.sh"
echo "To view logs: docker-compose -f backend/docker-compose.yml logs -f"

# Start frontend (this will block)
npm run dev