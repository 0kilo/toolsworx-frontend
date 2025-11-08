#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Starting Unified Conversion Service${NC}"
echo -e "${BLUE}========================================${NC}\n"

# Determine which docker-compose to use
if [ "$1" == "local" ]; then
    COMPOSE_FILE="docker-compose.local.yml"
    echo -e "${YELLOW}Using: docker-compose.local.yml (from project root)${NC}\n"
    cd "$(dirname "$0")/.."
else
    COMPOSE_FILE="docker-compose.yml"
    echo -e "${YELLOW}Using: backend/docker-compose.yml${NC}\n"
    cd "$(dirname "$0")"
fi

# Check if docker-compose is installed
if ! command -v docker-compose &> /dev/null
then
    echo "docker-compose could not be found. Please install it first."
    exit 1
fi

# Start services
echo -e "${GREEN}Starting services with Docker Compose...${NC}\n"

docker-compose -f "$COMPOSE_FILE" up -d

echo -e "\n${GREEN}✓ Services started!${NC}\n"

# Wait for services to be healthy
echo -e "${BLUE}Waiting for services to be ready...${NC}\n"
sleep 5

# Check health
echo -e "${GREEN}Checking service health:${NC}"
curl -s http://localhost:3000/health | python3 -m json.tool 2>/dev/null || curl -s http://localhost:3000/health

echo -e "\n${BLUE}========================================${NC}"
echo -e "${GREEN}✓ Unified Service is running!${NC}"
echo -e "${BLUE}========================================${NC}\n"

echo -e "Service URL: ${GREEN}http://localhost:3000${NC}"
echo -e "Health Check: ${GREEN}http://localhost:3000/health${NC}"
echo -e "Redis: ${GREEN}localhost:6379${NC}\n"

echo -e "To view logs:"
echo -e "  ${GREEN}docker-compose -f $COMPOSE_FILE logs -f unified-service${NC}\n"

echo -e "To stop services:"
if [ "$1" == "local" ]; then
    echo -e "  ${GREEN}./backend/stop-unified.sh local${NC}\n"
else
    echo -e "  ${GREEN}./backend/stop-unified.sh${NC}\n"
fi
