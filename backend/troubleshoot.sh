#!/bin/bash

# Troubleshooting script for unified backend service
# Run this if the service health check hangs

echo "========================================="
echo "Unified Backend Service Troubleshooting"
echo "========================================="
echo ""

# Check if running from backend directory
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ Please run this from the backend/ directory"
    echo "   cd backend && ./troubleshoot.sh"
    exit 1
fi

echo "1️⃣  Checking running containers..."
echo "-------------------------------------------"
docker compose ps
echo ""

echo "2️⃣  Checking unified-service logs (last 50 lines)..."
echo "-------------------------------------------"
docker compose logs --tail=50 unified-service
echo ""

echo "3️⃣  Checking Redis logs (last 20 lines)..."
echo "-------------------------------------------"
docker compose logs --tail=20 redis
echo ""

echo "4️⃣  Testing port 3000..."
echo "-------------------------------------------"
if nc -z localhost 3000 2>/dev/null; then
    echo "✅ Port 3000 is open"
else
    echo "❌ Port 3000 is NOT accessible"
fi
echo ""

echo "5️⃣  Testing Redis port 6379..."
echo "-------------------------------------------"
if nc -z localhost 6379 2>/dev/null; then
    echo "✅ Redis port 6379 is open"
else
    echo "❌ Redis port 6379 is NOT accessible"
fi
echo ""

echo "6️⃣  Checking if unified-service container is healthy..."
echo "-------------------------------------------"
CONTAINER_ID=$(docker compose ps -q unified-service)
if [ -z "$CONTAINER_ID" ]; then
    echo "❌ unified-service container is not running!"
    echo ""
    echo "Attempting to see why it failed..."
    docker compose logs unified-service
else
    HEALTH=$(docker inspect --format='{{.State.Health.Status}}' $CONTAINER_ID 2>/dev/null || echo "unknown")
    echo "Health status: $HEALTH"

    if [ "$HEALTH" == "healthy" ]; then
        echo "✅ Container is healthy"
    elif [ "$HEALTH" == "starting" ]; then
        echo "⏳ Container is still starting..."
    else
        echo "❌ Container is unhealthy or has no health check"
    fi
fi
echo ""

echo "7️⃣  Testing health endpoint directly..."
echo "-------------------------------------------"
if command -v curl &> /dev/null; then
    curl -v http://localhost:3000/health 2>&1 | head -20
else
    echo "curl not available, skipping direct test"
fi
echo ""

echo "========================================="
echo "Common Issues & Solutions"
echo "========================================="
echo ""
echo "Issue 1: Container keeps restarting"
echo "  → Check logs: docker compose logs unified-service"
echo "  → Likely cause: npm dependencies not installed"
echo "  → Fix: docker compose build --no-cache unified-service"
echo ""
echo "Issue 2: Port 3000 already in use"
echo "  → Check what's using it: lsof -i :3000"
echo "  → Kill the process or change the port"
echo ""
echo "Issue 3: Redis connection failed"
echo "  → Check Redis: docker compose logs redis"
echo "  → Restart Redis: docker compose restart redis"
echo ""
echo "Issue 4: Health check never responds"
echo "  → Container may not have curl installed"
echo "  → Check Dockerfile has curl in alpine packages"
echo ""
echo "Full rebuild (if all else fails):"
echo "  docker compose down -v"
echo "  docker compose build --no-cache"
echo "  docker compose up -d"
echo ""
