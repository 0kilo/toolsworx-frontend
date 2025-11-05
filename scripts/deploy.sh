#!/bin/bash
# Master deployment script for Convert-All on AWS

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
ENVIRONMENT="${ENVIRONMENT:-production}"
AWS_REGION="${AWS_REGION:-us-east-1}"
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
PROJECT_NAME="convert-all"

# ECR Repositories
FRONTEND_REPO="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${PROJECT_NAME}-frontend"
FILE_SERVICE_REPO="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${PROJECT_NAME}-file-service"
MEDIA_SERVICE_REPO="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${PROJECT_NAME}-media-service"
FILTER_SERVICE_REPO="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${PROJECT_NAME}-filter-service"

# Image tag (use git commit SHA or provide custom tag)
IMAGE_TAG="${IMAGE_TAG:-$(git rev-parse --short HEAD)}"

echo -e "${GREEN}======================================${NC}"
echo -e "${GREEN}Convert-All Deployment Script${NC}"
echo -e "${GREEN}======================================${NC}"
echo -e "Environment: ${YELLOW}${ENVIRONMENT}${NC}"
echo -e "AWS Region: ${YELLOW}${AWS_REGION}${NC}"
echo -e "AWS Account: ${YELLOW}${AWS_ACCOUNT_ID}${NC}"
echo -e "Image Tag: ${YELLOW}${IMAGE_TAG}${NC}"
echo -e "${GREEN}======================================${NC}\n"

# Function to print step
print_step() {
    echo -e "\n${GREEN}==>${NC} ${1}${NC}\n"
}

# Function to print error and exit
error_exit() {
    echo -e "\n${RED}ERROR: ${1}${NC}\n" >&2
    exit 1
}

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    error_exit "AWS CLI is not installed"
fi

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    error_exit "Docker is not installed"
fi

# Check AWS credentials
print_step "Checking AWS credentials..."
aws sts get-caller-identity > /dev/null || error_exit "AWS credentials not configured"

# Login to ECR
print_step "Logging in to Amazon ECR..."
aws ecr get-login-password --region ${AWS_REGION} | \
    docker login --username AWS --password-stdin ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com \
    || error_exit "Failed to login to ECR"

# Build and push frontend
print_step "Building frontend image..."
docker build -t ${PROJECT_NAME}-frontend:${IMAGE_TAG} ./frontend \
    || error_exit "Failed to build frontend image"

docker tag ${PROJECT_NAME}-frontend:${IMAGE_TAG} ${FRONTEND_REPO}:${IMAGE_TAG}
docker tag ${PROJECT_NAME}-frontend:${IMAGE_TAG} ${FRONTEND_REPO}:latest

print_step "Pushing frontend image to ECR..."
docker push ${FRONTEND_REPO}:${IMAGE_TAG} || error_exit "Failed to push frontend image"
docker push ${FRONTEND_REPO}:latest

# Build and push file conversion service
print_step "Building file conversion service image..."
docker build -t ${PROJECT_NAME}-file-service:${IMAGE_TAG} ./backend/file-conversion-service \
    || error_exit "Failed to build file service image"

docker tag ${PROJECT_NAME}-file-service:${IMAGE_TAG} ${FILE_SERVICE_REPO}:${IMAGE_TAG}
docker tag ${PROJECT_NAME}-file-service:${IMAGE_TAG} ${FILE_SERVICE_REPO}:latest

print_step "Pushing file service image to ECR..."
docker push ${FILE_SERVICE_REPO}:${IMAGE_TAG} || error_exit "Failed to push file service image"
docker push ${FILE_SERVICE_REPO}:latest

# Build and push media conversion service
print_step "Building media conversion service image..."
docker build -t ${PROJECT_NAME}-media-service:${IMAGE_TAG} ./backend/media-conversion-service \
    || error_exit "Failed to build media service image"

docker tag ${PROJECT_NAME}-media-service:${IMAGE_TAG} ${MEDIA_SERVICE_REPO}:${IMAGE_TAG}
docker tag ${PROJECT_NAME}-media-service:${IMAGE_TAG} ${MEDIA_SERVICE_REPO}:latest

print_step "Pushing media service image to ECR..."
docker push ${MEDIA_SERVICE_REPO}:${IMAGE_TAG} || error_exit "Failed to push media service image"
docker push ${MEDIA_SERVICE_REPO}:latest

# Build and push filter service
print_step "Building filter service image..."
docker build -t ${PROJECT_NAME}-filter-service:${IMAGE_TAG} ./backend/filter-service \
    || error_exit "Failed to build filter service image"

docker tag ${PROJECT_NAME}-filter-service:${IMAGE_TAG} ${FILTER_SERVICE_REPO}:${IMAGE_TAG}
docker tag ${PROJECT_NAME}-filter-service:${IMAGE_TAG} ${FILTER_SERVICE_REPO}:latest

print_step "Pushing filter service image to ECR..."
docker push ${FILTER_SERVICE_REPO}:${IMAGE_TAG} || error_exit "Failed to push filter service image"
docker push ${FILTER_SERVICE_REPO}:latest

# Update ECS services
print_step "Updating ECS services..."

CLUSTER_NAME="${PROJECT_NAME}-cluster-${ENVIRONMENT}"

# Update frontend service
aws ecs update-service \
    --cluster ${CLUSTER_NAME} \
    --service ${PROJECT_NAME}-frontend-${ENVIRONMENT} \
    --force-new-deployment \
    --region ${AWS_REGION} \
    > /dev/null || echo -e "${YELLOW}Warning: Failed to update frontend service (may not exist yet)${NC}"

# Update file conversion service
aws ecs update-service \
    --cluster ${CLUSTER_NAME} \
    --service ${PROJECT_NAME}-file-service-${ENVIRONMENT} \
    --force-new-deployment \
    --region ${AWS_REGION} \
    > /dev/null || echo -e "${YELLOW}Warning: Failed to update file service (may not exist yet)${NC}"

# Update media conversion service
aws ecs update-service \
    --cluster ${CLUSTER_NAME} \
    --service ${PROJECT_NAME}-media-service-${ENVIRONMENT} \
    --force-new-deployment \
    --region ${AWS_REGION} \
    > /dev/null || echo -e "${YELLOW}Warning: Failed to update media service (may not exist yet)${NC}"

# Update filter service
aws ecs update-service \
    --cluster ${CLUSTER_NAME} \
    --service ${PROJECT_NAME}-filter-service-${ENVIRONMENT} \
    --force-new-deployment \
    --region ${AWS_REGION} \
    > /dev/null || echo -e "${YELLOW}Warning: Failed to update filter service (may not exist yet)${NC}"

# Wait for services to stabilize
print_step "Waiting for services to stabilize..."
echo -e "${YELLOW}This may take 5-10 minutes...${NC}\n"

for service in "frontend" "file-service" "media-service" "filter-service"; do
    echo -e "Waiting for ${service}..."
    aws ecs wait services-stable \
        --cluster ${CLUSTER_NAME} \
        --services ${PROJECT_NAME}-${service}-${ENVIRONMENT} \
        --region ${AWS_REGION} \
        2>/dev/null || echo -e "${YELLOW}Service ${service} not found or timed out${NC}"
done

print_step "Deployment complete!"
echo -e "${GREEN}All services have been updated successfully!${NC}\n"

# Print service URLs
ALB_DNS=$(aws elbv2 describe-load-balancers \
    --names ${PROJECT_NAME}-alb-${ENVIRONMENT} \
    --query 'LoadBalancers[0].DNSName' \
    --output text \
    --region ${AWS_REGION} 2>/dev/null)

if [ ! -z "$ALB_DNS" ]; then
    echo -e "${GREEN}Application URL: ${YELLOW}https://${ALB_DNS}${NC}"
fi

echo -e "\n${GREEN}Deployment Summary:${NC}"
echo -e "  Image Tag: ${IMAGE_TAG}"
echo -e "  Environment: ${ENVIRONMENT}"
echo -e "  Region: ${AWS_REGION}"
echo -e "\nTo view logs:"
echo -e "  ${YELLOW}aws logs tail /ecs/${PROJECT_NAME}-frontend-${ENVIRONMENT} --follow${NC}"
echo -e "\nTo check service status:"
echo -e "  ${YELLOW}aws ecs describe-services --cluster ${CLUSTER_NAME} --services ${PROJECT_NAME}-frontend-${ENVIRONMENT}${NC}"
