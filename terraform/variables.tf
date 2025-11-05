# Variables for Convert-All Infrastructure

variable "aws_region" {
  description = "AWS region for resources"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Environment name (production, staging, development)"
  type        = string
  default     = "production"
}

variable "project_name" {
  description = "Project name for resource naming"
  type        = string
  default     = "convert-all"
}

# Networking Variables
variable "vpc_cidr" {
  description = "CIDR block for VPC"
  type        = string
  default     = "10.0.0.0/16"
}

# Database Variables
variable "db_instance_class" {
  description = "RDS instance class"
  type        = string
  default     = "db.r6g.xlarge"
}

variable "db_allocated_storage" {
  description = "Allocated storage for RDS in GB"
  type        = number
  default     = 500
}

variable "db_name" {
  description = "Database name"
  type        = string
  default     = "convertall"
}

variable "db_username" {
  description = "Database master username"
  type        = string
  default     = "postgres"
  sensitive   = true
}

# Redis Variables
variable "redis_node_type" {
  description = "ElastiCache node type"
  type        = string
  default     = "cache.r6g.large"
}

variable "redis_num_cache_clusters" {
  description = "Number of cache clusters (replicas + 1)"
  type        = number
  default     = 3
}

# ECS Service Images
variable "frontend_image" {
  description = "Docker image for frontend service"
  type        = string
}

variable "file_service_image" {
  description = "Docker image for file conversion service"
  type        = string
}

variable "media_service_image" {
  description = "Docker image for media conversion service"
  type        = string
}

variable "filter_service_image" {
  description = "Docker image for filter service"
  type        = string
}

# Scaling Configuration
variable "frontend_min_tasks" {
  description = "Minimum number of frontend tasks"
  type        = number
  default     = 2
}

variable "frontend_max_tasks" {
  description = "Maximum number of frontend tasks"
  type        = number
  default     = 10
}

variable "backend_min_tasks" {
  description = "Minimum number of backend service tasks"
  type        = number
  default     = 2
}

variable "backend_max_tasks" {
  description = "Maximum number of backend service tasks"
  type        = number
  default     = 8
}

# Monitoring
variable "alert_email" {
  description = "Email address for CloudWatch alerts"
  type        = string
}
