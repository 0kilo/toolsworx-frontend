#!/bin/bash

echo "🛑 Stopping TOOLS WORX local development environment..."

# Stop backend services
cd backend
docker-compose down

echo "✅ All services stopped"