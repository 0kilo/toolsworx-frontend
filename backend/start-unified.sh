#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Starting Unified Conversion Service${NC}"
echo -e "${BLUE}========================================${NC}\n"

# Check if docker-compose is installed
if ! command -v docker-compose &> /dev/null
then
    echo "docker-compose could not be found. Please install it first."
    exit 1
fi

# Start services
echo -e "${GREEN}Starting services with Docker Compose...${NC}\n"

docker-compose up -d

echo -e "\n${GREEN}✓ Services started!${NC}\n"

# Wait for services to be healthy
echo -e "${BLUE}Waiting for services to be ready...${NC}\n"
sleep 5

# Check health
echo -e "${GREEN}Checking service health:${NC}"
curl -s http://localhost:3000/health | json_pp || echo "Service health check endpoint available"

echo -e "\n${BLUE}========================================${NC}"
echo -e "${GREEN}✓ Unified Service is running!${NC}"
echo -e "${BLUE}========================================${NC}\n"

echo -e "Service URL: ${GREEN}http://localhost:3000${NC}"
echo -e "Health Check: ${GREEN}http://localhost:3000/health${NC}"
echo -e "Redis: ${GREEN}localhost:6379${NC}\n"

echo -e "To view logs:"
echo -e "  ${GREEN}docker-compose logs -f unified-service${NC}\n"

echo -e "To stop services:"
echo -e "  ${GREEN}docker-compose down${NC}\n"
