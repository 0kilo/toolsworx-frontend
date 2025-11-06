#!/bin/bash

echo "🧪 Testing TOOLS WORX backend services..."

# Test Redis
echo "Testing Redis connection..."
if docker-compose -f backend/docker-compose.yml exec redis redis-cli ping | grep -q "PONG"; then
    echo "✅ Redis is responding"
else
    echo "❌ Redis connection failed"
fi

# Test File Conversion Service
echo "Testing File Conversion Service..."
response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/health)
if [ "$response" = "200" ]; then
    echo "✅ File Conversion Service is healthy"
else
    echo "❌ File Conversion Service health check failed (HTTP $response)"
fi

# Test Media Conversion Service  
echo "Testing Media Conversion Service..."
response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/health)
if [ "$response" = "200" ]; then
    echo "✅ Media Conversion Service is healthy"
else
    echo "❌ Media Conversion Service health check failed (HTTP $response)"
fi

# Test Filter Service
echo "Testing Filter Service..."
response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3002/health)
if [ "$response" = "200" ]; then
    echo "✅ Filter Service is healthy"
else
    echo "❌ Filter Service health check failed (HTTP $response)"
fi

echo ""
echo "🔍 Service endpoints:"
echo "  File Conversion: http://localhost:3000"
echo "  Media Conversion: http://localhost:3001"
echo "  Filter Service: http://localhost:3002"
echo "  Redis: localhost:6379"