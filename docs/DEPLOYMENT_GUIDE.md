# Convert-All Deployment Guide

Quick start guide for deploying Convert-All to AWS.

## Prerequisites

1. **AWS Account** with appropriate permissions
2. **AWS CLI** installed and configured
3. **Terraform** >= 1.5.0 installed
4. **Docker** installed
5. **Domain** registered and added to Cloudflare
6. **Git** repository access

## Quick Deployment

### Step 1: Setup Infrastructure

```bash
# Set environment variables
export ENVIRONMENT=production
export AWS_REGION=us-east-1

# Run infrastructure setup
./scripts/setup-infrastructure.sh
```

This script will:
- Create S3 bucket for Terraform state
- Create DynamoDB table for state locking
- Create ECR repositories
- Deploy VPC, subnets, security groups
- Create RDS PostgreSQL database
- Create ElastiCache Redis cluster
- Setup ECS cluster and ALB
- Create S3 buckets for file storage

**Time:** 20-30 minutes

### Step 2: Deploy Application

```bash
# Build and deploy all services
./scripts/deploy.sh
```

This script will:
- Build Docker images for frontend and backend services
- Push images to ECR
- Update ECS services
- Wait for deployment to stabilize

**Time:** 10-15 minutes

### Step 3: Configure DNS

After deployment completes, get the ALB DNS name:

```bash
cd terraform
terraform output alb_dns_name
```

In Cloudflare:
1. Add A record: `convert-all.com` → ALB DNS (proxied)
2. Add CNAME record: `www.convert-all.com` → `convert-all.com` (proxied)
3. Enable "Always Use HTTPS"
4. Configure WAF rules (optional)

### Step 4: Verify Deployment

```bash
# Check health
curl https://convert-all.com/api/health

# View logs
aws logs tail /ecs/convert-all-frontend-production --follow

# Check service status
aws ecs describe-services \
  --cluster convert-all-cluster-production \
  --services convert-all-frontend-production
```

## Architecture Overview

```
Internet → Cloudflare CDN/WAF → AWS ALB → ECS Fargate Services
                                      ↓
                            ┌─────────┴─────────┐
                            │                    │
                         RDS PostgreSQL    ElastiCache Redis
                            │                    │
                            └────────────────────┘
                                      ↓
                                  S3 Storage
```

## Common Operations

### Update Application

```bash
# Build and deploy latest changes
IMAGE_TAG=v1.2.3 ./scripts/deploy.sh
```

### Rollback Deployment

```bash
# Rollback to previous version
./scripts/rollback.sh
```

### Scale Services

```bash
# Scale frontend to 5 tasks
aws ecs update-service \
  --cluster convert-all-cluster-production \
  --service convert-all-frontend-production \
  --desired-count 5
```

### View Logs

```bash
# Frontend logs
aws logs tail /ecs/convert-all-frontend-production --follow

# File service logs
aws logs tail /ecs/convert-all-file-service-production --follow

# Media service logs
aws logs tail /ecs/convert-all-media-service-production --follow

# Filter service logs
aws logs tail /ecs/convert-all-filter-service-production --follow
```

### Database Access

```bash
# Get database credentials
aws secretsmanager get-secret-value \
  --secret-id convert-all-database-url-production \
  --query SecretString \
  --output text | jq -r '.password'

# Connect via psql (requires bastion host or VPN)
psql postgresql://postgres:PASSWORD@RDS_ENDPOINT:5432/convertall
```

### Redis Access

```bash
# Get Redis endpoint
aws secretsmanager get-secret-value \
  --secret-id convert-all-redis-url-production \
  --query SecretString \
  --output text | jq -r '.host'

# Connect via redis-cli (requires bastion host or VPN)
redis-cli -h REDIS_ENDPOINT --tls
```

## Monitoring

### CloudWatch Dashboards

1. Go to CloudWatch Console
2. Navigate to Dashboards
3. View `convert-all-production` dashboard

### Set Up Alerts

Edit `terraform/monitoring/main.tf` to add SNS topic subscribers:

```hcl
resource "aws_sns_topic_subscription" "alerts" {
  topic_arn = aws_sns_topic.alerts.arn
  protocol  = "email"
  endpoint  = "ops@your-domain.com"
}
```

Then apply:

```bash
cd terraform
terraform apply -var-file=prod.tfvars
```

## Troubleshooting

### Services Not Starting

```bash
# Check task failures
aws ecs describe-tasks \
  --cluster convert-all-cluster-production \
  --tasks $(aws ecs list-tasks \
    --cluster convert-all-cluster-production \
    --service-name convert-all-frontend-production \
    --query 'taskArns[0]' \
    --output text)

# Check CloudWatch logs for errors
aws logs tail /ecs/convert-all-frontend-production --since 1h
```

### Database Connection Issues

1. Check security groups allow ECS → RDS on port 5432
2. Verify database credentials in Secrets Manager
3. Check RDS instance status
4. Review VPC configuration

### High Latency

1. Check ALB target health
2. Review CloudWatch metrics for CPU/memory
3. Scale up services if needed
4. Check database performance insights
5. Review Redis cache hit rate

### Cost Optimization

```bash
# Use Fargate Spot for non-critical workloads
# Update service capacity providers in Terraform

# Enable S3 Intelligent-Tiering
aws s3api put-bucket-intelligent-tiering-configuration \
  --bucket convert-all-outputs-production \
  --id IntelligentTiering \
  --intelligent-tiering-configuration file://s3-tiering.json

# Consider RDS Reserved Instances
# Calculate savings: https://aws.amazon.com/rds/reserved-instances/
```

## Disaster Recovery

### Backup Procedures

**Automated:**
- RDS: Daily automated snapshots (7-day retention)
- ElastiCache: Daily automated backups (7-day retention)
- S3: Versioning enabled with lifecycle policies

**Manual Backup:**

```bash
# Create RDS snapshot
aws rds create-db-snapshot \
  --db-instance-identifier convert-all-db-production \
  --db-snapshot-identifier manual-backup-$(date +%Y%m%d)

# Create Redis snapshot
aws elasticache create-snapshot \
  --replication-group-id convert-all-redis-production \
  --snapshot-name manual-backup-$(date +%Y%m%d)
```

### Restore Procedures

**Database Restore:**

```bash
# Restore from snapshot
aws rds restore-db-instance-from-db-snapshot \
  --db-instance-identifier convert-all-db-restored \
  --db-snapshot-identifier <snapshot-id>
```

**Full Environment Restore:**

1. Restore infrastructure from Terraform state
2. Restore database from snapshot
3. Restore Redis from backup
4. Deploy application using `./scripts/deploy.sh`
5. Update DNS records
6. Verify all services

## Security Best Practices

1. **Enable MFA** on AWS root account
2. **Rotate secrets** regularly (automated via Secrets Manager)
3. **Review IAM policies** quarterly
4. **Enable CloudTrail** for audit logging
5. **Configure WAF rules** in Cloudflare
6. **Enable GuardDuty** for threat detection
7. **Use VPC Flow Logs** for network monitoring
8. **Scan Docker images** for vulnerabilities (ECR scanning enabled)

## Cost Monitoring

### Monthly Cost Estimate

- **ECS Fargate:** $1,000 - $4,000 (varies with load)
- **RDS PostgreSQL:** $635
- **ElastiCache Redis:** $1,350
- **S3 Storage:** $23 - $100
- **Data Transfer:** $90 - $200
- **ALB:** $20
- **NAT Gateway:** $90
- **CloudWatch:** $55

**Total:** ~$3,200 - $6,400/month

### Cost Optimization Tips

1. Use Fargate Spot (70% savings on non-critical tasks)
2. Right-size RDS and Redis instances
3. Implement aggressive S3 lifecycle policies
4. Use CloudFront for static assets
5. Consider Reserved Instances for predictable workloads

## Support

- **Documentation:** See `AWS_DEPLOYMENT_PLAN.md` for detailed architecture
- **Issues:** GitHub Issues
- **Monitoring:** CloudWatch Dashboards
- **Alerts:** Configure SNS topics in Terraform

## Additional Resources

- [AWS ECS Best Practices](https://docs.aws.amazon.com/AmazonECS/latest/bestpracticesguide/)
- [Terraform AWS Provider Docs](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)
- [Cloudflare Docs](https://developers.cloudflare.com/)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
