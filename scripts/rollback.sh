#!/bin/bash
# Rollback script to revert to previous deployment

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Configuration
ENVIRONMENT="${ENVIRONMENT:-production}"
AWS_REGION="${AWS_REGION:-us-east-1}"
PROJECT_NAME="convert-all"
CLUSTER_NAME="${PROJECT_NAME}-cluster-${ENVIRONMENT}"

echo -e "${YELLOW}======================================${NC}"
echo -e "${YELLOW}Convert-All Rollback Script${NC}"
echo -e "${YELLOW}======================================${NC}"

# Function to print step
print_step() {
    echo -e "\n${GREEN}==>${NC} ${1}${NC}\n"
}

# Function to rollback a service
rollback_service() {
    local service_name=$1

    echo -e "Rolling back ${service_name}..."

    # Get current task definition
    current_task_def=$(aws ecs describe-services \
        --cluster ${CLUSTER_NAME} \
        --services ${service_name} \
        --query 'services[0].taskDefinition' \
        --output text \
        --region ${AWS_REGION})

    # Get task definition family
    family=$(echo $current_task_def | cut -d':' -f1 | cut -d'/' -f2)
    current_revision=$(echo $current_task_def | cut -d':' -f2)

    # Calculate previous revision
    previous_revision=$((current_revision - 1))

    if [ $previous_revision -lt 1 ]; then
        echo -e "${RED}No previous revision found for ${service_name}${NC}"
        return 1
    fi

    previous_task_def="${family}:${previous_revision}"

    echo -e "Current task definition: ${YELLOW}${current_task_def}${NC}"
    echo -e "Rolling back to: ${YELLOW}${previous_task_def}${NC}"

    # Update service to use previous task definition
    aws ecs update-service \
        --cluster ${CLUSTER_NAME} \
        --service ${service_name} \
        --task-definition ${previous_task_def} \
        --region ${AWS_REGION} \
        > /dev/null

    echo -e "${GREEN}Rollback initiated for ${service_name}${NC}"
}

# Services to rollback
SERVICES=(
    "${PROJECT_NAME}-frontend-${ENVIRONMENT}"
    "${PROJECT_NAME}-file-service-${ENVIRONMENT}"
    "${PROJECT_NAME}-media-service-${ENVIRONMENT}"
    "${PROJECT_NAME}-filter-service-${ENVIRONMENT}"
)

# Ask which services to rollback
echo -e "\nWhich services do you want to rollback?"
echo "1) All services"
echo "2) Frontend only"
echo "3) Backend services only"
echo "4) Custom selection"
read -p "Enter your choice (1-4): " choice

case $choice in
    1)
        SELECTED_SERVICES=("${SERVICES[@]}")
        ;;
    2)
        SELECTED_SERVICES=("${PROJECT_NAME}-frontend-${ENVIRONMENT}")
        ;;
    3)
        SELECTED_SERVICES=(
            "${PROJECT_NAME}-file-service-${ENVIRONMENT}"
            "${PROJECT_NAME}-media-service-${ENVIRONMENT}"
            "${PROJECT_NAME}-filter-service-${ENVIRONMENT}"
        )
        ;;
    4)
        echo "Enter service names (comma-separated):"
        read -p "> " services_input
        IFS=',' read -ra SELECTED_SERVICES <<< "$services_input"
        ;;
    *)
        echo -e "${RED}Invalid choice${NC}"
        exit 1
        ;;
esac

# Confirm rollback
echo -e "\n${RED}WARNING: This will rollback the following services:${NC}"
for service in "${SELECTED_SERVICES[@]}"; do
    echo "  - $service"
done
echo -e "\n${YELLOW}Are you sure you want to proceed? (yes/no)${NC}"
read -r response

if [ "$response" != "yes" ]; then
    echo -e "${RED}Rollback cancelled${NC}"
    exit 1
fi

# Perform rollback
print_step "Starting rollback..."

for service in "${SELECTED_SERVICES[@]}"; do
    rollback_service "$service"
done

# Wait for services to stabilize
print_step "Waiting for services to stabilize..."

for service in "${SELECTED_SERVICES[@]}"; do
    echo "Waiting for $service..."
    aws ecs wait services-stable \
        --cluster ${CLUSTER_NAME} \
        --services "$service" \
        --region ${AWS_REGION}
done

print_step "Rollback complete!"
echo -e "${GREEN}All selected services have been rolled back successfully!${NC}\n"
