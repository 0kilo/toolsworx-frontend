#!/bin/bash
# Script to setup AWS infrastructure using Terraform

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
ENVIRONMENT="${ENVIRONMENT:-production}"
AWS_REGION="${AWS_REGION:-us-east-1}"
PROJECT_NAME="convert-all"

echo -e "${GREEN}======================================${NC}"
echo -e "${GREEN}Convert-All Infrastructure Setup${NC}"
echo -e "${GREEN}======================================${NC}"
echo -e "Environment: ${YELLOW}${ENVIRONMENT}${NC}"
echo -e "AWS Region: ${YELLOW}${AWS_REGION}${NC}"
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

# Check if Terraform is installed
if ! command -v terraform &> /dev/null; then
    error_exit "Terraform is not installed. Please install Terraform first."
fi

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    error_exit "AWS CLI is not installed"
fi

# Check AWS credentials
print_step "Checking AWS credentials..."
aws sts get-caller-identity > /dev/null || error_exit "AWS credentials not configured"

AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
echo -e "AWS Account ID: ${YELLOW}${AWS_ACCOUNT_ID}${NC}\n"

# Create S3 bucket for Terraform state (if it doesn't exist)
print_step "Setting up Terraform state backend..."
STATE_BUCKET="${PROJECT_NAME}-terraform-state"

if ! aws s3 ls s3://${STATE_BUCKET} 2>/dev/null; then
    echo "Creating S3 bucket for Terraform state..."
    aws s3api create-bucket \
        --bucket ${STATE_BUCKET} \
        --region ${AWS_REGION} \
        || error_exit "Failed to create S3 bucket for Terraform state"

    # Enable versioning
    aws s3api put-bucket-versioning \
        --bucket ${STATE_BUCKET} \
        --versioning-configuration Status=Enabled

    # Enable encryption
    aws s3api put-bucket-encryption \
        --bucket ${STATE_BUCKET} \
        --server-side-encryption-configuration '{
            "Rules": [{
                "ApplyServerSideEncryptionByDefault": {
                    "SSEAlgorithm": "AES256"
                }
            }]
        }'

    echo -e "${GREEN}Terraform state bucket created successfully${NC}"
else
    echo -e "${YELLOW}Terraform state bucket already exists${NC}"
fi

# Create DynamoDB table for state locking (if it doesn't exist)
LOCK_TABLE="${PROJECT_NAME}-terraform-locks"

if ! aws dynamodb describe-table --table-name ${LOCK_TABLE} --region ${AWS_REGION} 2>/dev/null; then
    echo "Creating DynamoDB table for state locking..."
    aws dynamodb create-table \
        --table-name ${LOCK_TABLE} \
        --attribute-definitions AttributeName=LockID,AttributeType=S \
        --key-schema AttributeName=LockID,KeyType=HASH \
        --billing-mode PAY_PER_REQUEST \
        --region ${AWS_REGION} \
        || error_exit "Failed to create DynamoDB table for state locking"

    echo "Waiting for table to be created..."
    aws dynamodb wait table-exists --table-name ${LOCK_TABLE} --region ${AWS_REGION}
    echo -e "${GREEN}DynamoDB table created successfully${NC}"
else
    echo -e "${YELLOW}DynamoDB table already exists${NC}"
fi

# Create ECR repositories (if they don't exist)
print_step "Setting up ECR repositories..."

REPOSITORIES=("frontend" "file-service" "media-service" "filter-service")

for repo in "${REPOSITORIES[@]}"; do
    REPO_NAME="${PROJECT_NAME}-${repo}"

    if ! aws ecr describe-repositories --repository-names ${REPO_NAME} --region ${AWS_REGION} 2>/dev/null; then
        echo "Creating ECR repository: ${REPO_NAME}..."
        aws ecr create-repository \
            --repository-name ${REPO_NAME} \
            --region ${AWS_REGION} \
            --image-scanning-configuration scanOnPush=true \
            --encryption-configuration encryptionType=AES256 \
            || error_exit "Failed to create ECR repository: ${REPO_NAME}"

        # Set lifecycle policy to keep last 10 images
        aws ecr put-lifecycle-policy \
            --repository-name ${REPO_NAME} \
            --region ${AWS_REGION} \
            --lifecycle-policy-text '{
                "rules": [{
                    "rulePriority": 1,
                    "description": "Keep last 10 images",
                    "selection": {
                        "tagStatus": "any",
                        "countType": "imageCountMoreThan",
                        "countNumber": 10
                    },
                    "action": {
                        "type": "expire"
                    }
                }]
            }'

        echo -e "${GREEN}ECR repository ${REPO_NAME} created${NC}"
    else
        echo -e "${YELLOW}ECR repository ${REPO_NAME} already exists${NC}"
    fi
done

# Update terraform variables file with correct image URLs
print_step "Updating Terraform variables..."
cd terraform

# Create or update prod.tfvars with actual values
cat > prod.tfvars << EOF
environment  = "${ENVIRONMENT}"
aws_region   = "${AWS_REGION}"
project_name = "${PROJECT_NAME}"

# Networking
vpc_cidr = "10.0.0.0/16"

# Database
db_instance_class    = "db.r6g.xlarge"
db_allocated_storage = 500
db_name             = "convertall"
db_username         = "postgres"

# Redis
redis_node_type          = "cache.r6g.large"
redis_num_cache_clusters = 3

# Docker Images
frontend_image       = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${PROJECT_NAME}-frontend:latest"
file_service_image   = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${PROJECT_NAME}-file-service:latest"
media_service_image  = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${PROJECT_NAME}-media-service:latest"
filter_service_image = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${PROJECT_NAME}-filter-service:latest"

# Scaling
frontend_min_tasks = 2
frontend_max_tasks = 10
backend_min_tasks  = 2
backend_max_tasks  = 8

# Monitoring
alert_email = "ops@convert-all.com"
EOF

echo -e "${GREEN}Terraform variables updated${NC}"

# Initialize Terraform
print_step "Initializing Terraform..."
terraform init || error_exit "Terraform init failed"

# Validate Terraform configuration
print_step "Validating Terraform configuration..."
terraform validate || error_exit "Terraform validation failed"

# Plan infrastructure
print_step "Planning infrastructure changes..."
terraform plan -var-file=prod.tfvars -out=tfplan || error_exit "Terraform plan failed"

# Ask for confirmation
echo -e "\n${YELLOW}Do you want to apply these changes? (yes/no)${NC}"
read -r response

if [ "$response" = "yes" ]; then
    print_step "Applying infrastructure changes..."
    terraform apply tfplan || error_exit "Terraform apply failed"

    print_step "Infrastructure setup complete!"
    echo -e "${GREEN}All AWS resources have been created successfully!${NC}\n"

    # Get outputs
    echo -e "${GREEN}Infrastructure Outputs:${NC}"
    terraform output

    echo -e "\n${GREEN}Next Steps:${NC}"
    echo -e "1. Update your Cloudflare DNS to point to the ALB:"
    terraform output -raw alb_dns_name
    echo -e "\n2. Build and deploy your application:"
    echo -e "   ${YELLOW}cd .. && ./scripts/deploy.sh${NC}"
    echo -e "\n3. Configure monitoring and alerts in CloudWatch"

else
    echo -e "${RED}Infrastructure setup cancelled${NC}"
    exit 1
fi
