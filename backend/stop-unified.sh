#!/bin/bash

# Colors for output
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Stopping Unified Conversion Service${NC}"
echo -e "${BLUE}========================================${NC}\n"

docker-compose down

echo -e "\n${RED}✓ All services stopped!${NC}\n"
