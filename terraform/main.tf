# Main Terraform configuration for Convert-All on AWS
# This file orchestrates all infrastructure components

terraform {
  required_version = ">= 1.5.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  # Backend configuration for state management
  backend "s3" {
    bucket         = "convert-all-terraform-state"
    key            = "production/terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "convert-all-terraform-locks"
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = "convert-all"
      Environment = var.environment
      ManagedBy   = "terraform"
    }
  }
}

# Data sources
data "aws_caller_identity" "current" {}
data "aws_availability_zones" "available" {
  state = "available"
}

# Networking Module
module "networking" {
  source = "./networking"

  environment         = var.environment
  vpc_cidr           = var.vpc_cidr
  availability_zones = slice(data.aws_availability_zones.available.names, 0, 2)
  project_name       = var.project_name
}

# Data Layer Module (RDS, ElastiCache)
module "data" {
  source = "./data"

  environment          = var.environment
  project_name         = var.project_name
  vpc_id              = module.networking.vpc_id
  private_subnet_ids  = module.networking.private_subnet_ids
  data_subnet_ids     = module.networking.data_subnet_ids
  ecs_security_group_id = module.compute.ecs_security_group_id

  # RDS Configuration
  db_instance_class    = var.db_instance_class
  db_allocated_storage = var.db_allocated_storage
  db_name             = var.db_name
  db_username         = var.db_username

  # Redis Configuration
  redis_node_type      = var.redis_node_type
  redis_num_cache_clusters = var.redis_num_cache_clusters
}

# Compute Layer Module (ECS, ALB)
module "compute" {
  source = "./compute"

  environment          = var.environment
  project_name         = var.project_name
  vpc_id              = module.networking.vpc_id
  public_subnet_ids   = module.networking.public_subnet_ids
  private_subnet_ids  = module.networking.private_subnet_ids

  # Database and Cache endpoints
  database_endpoint    = module.data.rds_endpoint
  redis_endpoint       = module.data.redis_endpoint

  # Service Configuration
  frontend_image       = var.frontend_image
  file_service_image   = var.file_service_image
  media_service_image  = var.media_service_image
  filter_service_image = var.filter_service_image

  # Scaling Configuration
  frontend_min_tasks   = var.frontend_min_tasks
  frontend_max_tasks   = var.frontend_max_tasks
  backend_min_tasks    = var.backend_min_tasks
  backend_max_tasks    = var.backend_max_tasks
}

# Monitoring Module (CloudWatch, X-Ray)
module "monitoring" {
  source = "./monitoring"

  environment  = var.environment
  project_name = var.project_name

  # ECS Resources
  ecs_cluster_name = module.compute.ecs_cluster_name
  ecs_service_names = module.compute.ecs_service_names

  # ALB Resources
  alb_arn = module.compute.alb_arn

  # Alert Configuration
  alert_email = var.alert_email
}

# S3 Buckets for file storage
resource "aws_s3_bucket" "uploads" {
  bucket = "${var.project_name}-uploads-${var.environment}"

  tags = {
    Name        = "Uploads Bucket"
    Environment = var.environment
  }
}

resource "aws_s3_bucket" "outputs" {
  bucket = "${var.project_name}-outputs-${var.environment}"

  tags = {
    Name        = "Outputs Bucket"
    Environment = var.environment
  }
}

resource "aws_s3_bucket" "static" {
  bucket = "${var.project_name}-static-${var.environment}"

  tags = {
    Name        = "Static Assets Bucket"
    Environment = var.environment
  }
}

# S3 Bucket Lifecycle Policies
resource "aws_s3_bucket_lifecycle_configuration" "uploads" {
  bucket = aws_s3_bucket.uploads.id

  rule {
    id     = "delete-old-uploads"
    status = "Enabled"

    expiration {
      days = 1
    }
  }
}

resource "aws_s3_bucket_lifecycle_configuration" "outputs" {
  bucket = aws_s3_bucket.outputs.id

  rule {
    id     = "delete-old-outputs"
    status = "Enabled"

    expiration {
      days = 2
    }
  }
}

# Enable versioning for static assets
resource "aws_s3_bucket_versioning" "static" {
  bucket = aws_s3_bucket.static.id

  versioning_configuration {
    status = "Enabled"
  }
}

# Bucket encryption
resource "aws_s3_bucket_server_side_encryption_configuration" "uploads" {
  bucket = aws_s3_bucket.uploads.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "outputs" {
  bucket = aws_s3_bucket.outputs.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

# Outputs
output "vpc_id" {
  description = "VPC ID"
  value       = module.networking.vpc_id
}

output "alb_dns_name" {
  description = "Application Load Balancer DNS name"
  value       = module.compute.alb_dns_name
}

output "rds_endpoint" {
  description = "RDS endpoint"
  value       = module.data.rds_endpoint
  sensitive   = true
}

output "redis_endpoint" {
  description = "Redis endpoint"
  value       = module.data.redis_endpoint
  sensitive   = true
}

output "s3_uploads_bucket" {
  description = "S3 uploads bucket name"
  value       = aws_s3_bucket.uploads.id
}

output "s3_outputs_bucket" {
  description = "S3 outputs bucket name"
  value       = aws_s3_bucket.outputs.id
}

output "s3_static_bucket" {
  description = "S3 static assets bucket name"
  value       = aws_s3_bucket.static.id
}
