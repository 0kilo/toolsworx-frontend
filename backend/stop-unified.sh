#!/bin/bash

# Colors for output
RED='\033[0;31m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Stopping Unified Conversion Service${NC}"
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

docker-compose -f "$COMPOSE_FILE" down

echo -e "\n${RED}✓ All services stopped!${NC}\n"
