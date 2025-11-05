# Compute Layer Module Variables

variable "environment" {
  description = "Environment name"
  type        = string
}

variable "project_name" {
  description = "Project name"
  type        = string
}

variable "vpc_id" {
  description = "VPC ID"
  type        = string
}

variable "public_subnet_ids" {
  description = "List of public subnet IDs"
  type        = list(string)
}

variable "private_subnet_ids" {
  description = "List of private subnet IDs"
  type        = list(string)
}

variable "database_endpoint" {
  description = "RDS database endpoint"
  type        = string
}

variable "redis_endpoint" {
  description = "Redis endpoint"
  type        = string
}

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

variable "frontend_min_tasks" {
  description = "Minimum number of frontend tasks"
  type        = number
}

variable "frontend_max_tasks" {
  description = "Maximum number of frontend tasks"
  type        = number
}

variable "backend_min_tasks" {
  description = "Minimum number of backend service tasks"
  type        = number
}

variable "backend_max_tasks" {
  description = "Maximum number of backend service tasks"
  type        = number
}

variable "acm_certificate_arn" {
  description = "ACM certificate ARN for HTTPS"
  type        = string
  default     = ""
}

variable "s3_bucket_arns" {
  description = "List of S3 bucket ARNs for IAM policy"
  type        = list(string)
  default     = []
}

variable "cloudflare_ips" {
  description = "Cloudflare IP ranges for ALB security group"
  type        = list(string)
  default = [
    "173.245.48.0/20",
    "103.21.244.0/22",
    "103.22.200.0/22",
    "103.31.4.0/22",
    "141.101.64.0/18",
    "108.162.192.0/18",
    "190.93.240.0/20",
    "188.114.96.0/20",
    "197.234.240.0/22",
    "198.41.128.0/17",
    "162.158.0.0/15",
    "104.16.0.0/13",
    "104.24.0.0/14",
    "172.64.0.0/13",
    "131.0.72.0/22"
  ]
}
