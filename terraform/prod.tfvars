# Production environment variables

environment  = "production"
aws_region   = "us-east-1"
project_name = "convert-all"

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

# Docker Images (update these with your ECR URLs)
frontend_image       = "ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/convert-all-frontend:latest"
file_service_image   = "ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/convert-all-file-service:latest"
media_service_image  = "ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/convert-all-media-service:latest"
filter_service_image = "ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/convert-all-filter-service:latest"

# Scaling
frontend_min_tasks = 2
frontend_max_tasks = 10
backend_min_tasks  = 2
backend_max_tasks  = 8

# Monitoring
alert_email = "ops@convert-all.com"
