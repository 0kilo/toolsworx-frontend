# Convert-All Backend Services

Three microservices for file, media, and filter processing with AWS Elastic Beanstalk support.

## Services

### 1. File Conversion Service (Port 3000)
- **Purpose**: Document and file format conversions
- **Technologies**: LibreOffice, Pandoc, XLSX
- **Formats**: PDF ↔ Word, Excel ↔ CSV, Archives (ZIP, TAR), JSON/XML/YAML
- **Directory**: `file-conversion-service/`

### 2. Media Conversion Service (Port 3001)
- **Purpose**: Video and audio format conversions
- **Technologies**: FFmpeg, SoX
- **Formats**: Video (MP4, AVI, MOV, WebM), Audio (MP3, WAV, FLAC, AAC)
- **Directory**: `media-conversion-service/`

### 3. Filter Service (Port 3002)
- **Purpose**: Apply filters to images, audio, and data
- **Technologies**: Sharp (image processing)
- **Filters**: Grayscale, Sepia, Blur, Sharpen, Brightness, Contrast, Vintage
- **Directory**: `filter-service/`

## Quick Start

### Using Docker Compose (Recommended)

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

**Service URLs:**
- File Conversion: http://localhost:3000
- Media Conversion: http://localhost:3001
- Filter Service: http://localhost:3002
- Redis: localhost:6379

### Manual Setup

Each service can be run independently:

```bash
# File Conversion Service
cd file-conversion-service
npm install
npm run build
npm start

# Media Conversion Service
cd media-conversion-service
npm install
npm run build
npm start

# Filter Service
cd filter-service
npm install
npm run build
npm start
```

**Requirements:**
- Node.js 20+
- Redis server running
- LibreOffice (for file service)
- FFmpeg (for media service)

## API Examples

### File Conversion

```bash
# Convert PDF to Word
curl -X POST http://localhost:3000/api/convert \
  -F "file=@document.pdf" \
  -F "targetFormat=docx"

# Check status
curl http://localhost:3000/api/status/JOB_ID

# Download result
curl http://localhost:3000/api/download/JOB_ID -o converted.docx
```

### Media Conversion

```bash
# Convert video to MP4
curl -X POST http://localhost:3001/api/convert \
  -F "file=@video.avi" \
  -F "outputFormat=mp4" \
  -F 'options={"videoCodec":"libx264","bitrate":"2000k"}'

# Check status
curl http://localhost:3001/api/status/JOB_ID

# Download result
curl http://localhost:3001/api/download/JOB_ID -o video.mp4
```

### Image Filters

```bash
# Apply filters to image
curl -X POST http://localhost:3002/api/filter \
  -F "file=@photo.jpg" \
  -F 'filters=[{"type":"grayscale"},{"type":"blur","value":2}]' \
  -F "outputFormat=jpeg"

# Check status
curl http://localhost:3002/api/status/JOB_ID

# Download result
curl http://localhost:3002/api/download/JOB_ID -o filtered.jpg
```

## AWS Elastic Beanstalk Deployment

### Prerequisites

1. Install AWS CLI and EB CLI:
```bash
pip install awscli awsebcli
aws configure
```

2. Create Redis instance (ElastiCache):
```bash
aws elasticache create-cache-cluster \
  --cache-cluster-id convert-all-redis \
  --cache-node-type cache.t3.micro \
  --engine redis \
  --num-cache-nodes 1
```

### Deploy Services

Each service can be deployed independently to Elastic Beanstalk:

#### File Conversion Service

```bash
cd file-conversion-service

# Initialize EB
eb init -p docker file-conversion-service --region us-east-1

# Create environment
eb create file-conversion-prod \
  --instance-type t3.medium \
  --elb-type application \
  --envvars NODE_ENV=production,REDIS_URL=redis://YOUR-REDIS-HOST:6379

# Deploy
eb deploy

# View status
eb status

# View logs
eb logs
```

#### Media Conversion Service

```bash
cd media-conversion-service

eb init -p docker media-conversion-service --region us-east-1

eb create media-conversion-prod \
  --instance-type t3.large \
  --elb-type application \
  --envvars NODE_ENV=production,REDIS_URL=redis://YOUR-REDIS-HOST:6379

eb deploy
```

#### Filter Service

```bash
cd filter-service

eb init -p docker filter-service --region us-east-1

eb create filter-service-prod \
  --instance-type t3.medium \
  --elb-type application \
  --envvars NODE_ENV=production,REDIS_URL=redis://YOUR-REDIS-HOST:6379

eb deploy
```

### Multi-Container Deployment

For deploying all services together, use the `Dockerrun.aws.json` in the root:

```bash
# From backend/ directory
eb init -p multi-container-docker convert-all-backend
eb create convert-all-prod --instance-type t3.xlarge
eb deploy
```

### Environment Variables

Set via EB Console or CLI:

```bash
eb setenv \
  NODE_ENV=production \
  REDIS_URL=redis://your-redis-endpoint:6379 \
  MAX_FILE_SIZE=524288000 \
  CORS_ORIGIN=https://yourfrontend.com
```

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     Load Balancer (ALB)                  │
└─────────────────────┬───────────────────────────────────┘
                      │
        ┌─────────────┼─────────────┐
        │             │             │
        ▼             ▼             ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│   File       │ │   Media      │ │   Filter     │
│ Conversion   │ │ Conversion   │ │  Service     │
│ Service      │ │ Service      │ │              │
│ (Port 3000)  │ │ (Port 3001)  │ │ (Port 3002)  │
└──────┬───────┘ └──────┬───────┘ └──────┬───────┘
       │                │                │
       └────────────────┼────────────────┘
                        │
                        ▼
                 ┌──────────────┐
                 │    Redis     │
                 │  (Job Queue) │
                 └──────────────┘
```

## Monitoring

### Health Checks

All services expose `/health` endpoints:

- File: http://localhost:3000/health
- Media: http://localhost:3001/health
- Filter: http://localhost:3002/health

### Prometheus Metrics

Available at `/metrics` on each service for monitoring with Prometheus/Grafana.

### Logs

View logs in AWS CloudWatch or locally:

```bash
# Docker Compose logs
docker-compose logs -f [service-name]

# EB logs
eb logs --all
```

## Scaling

### Horizontal Scaling

Configure auto-scaling in EB Console or via CLI:

```bash
eb scale 3  # Scale to 3 instances
```

### Load Balancing

Services are deployed behind Application Load Balancer (ALB) with:
- Health check paths
- Sticky sessions
- HTTPS/SSL termination

### Redis Scaling

Use ElastiCache cluster mode for better performance:
```bash
aws elasticache create-replication-group \
  --replication-group-id convert-all-cluster \
  --replication-group-description "Redis cluster" \
  --automatic-failover-enabled \
  --cache-node-type cache.r6g.large \
  --num-cache-clusters 2
```

## Security

### Best Practices

1. **Environment Variables**: Never commit secrets
2. **IAM Roles**: Use instance profiles for AWS access
3. **VPC**: Deploy in private subnets
4. **Security Groups**: Restrict access to necessary ports
5. **Rate Limiting**: Implemented at application level
6. **File Validation**: All uploads validated before processing

### SSL/TLS

Configure in EB load balancer:
```bash
eb ssl create --certificate-arn arn:aws:acm:region:account:certificate/id
```

## Troubleshooting

### Common Issues

**1. Redis Connection Failed**
```bash
# Test Redis connectivity
redis-cli -h YOUR-REDIS-HOST -p 6379 ping
```

**2. Out of Memory**
```bash
# Increase instance size or memory limits
eb scale --instance-type t3.xlarge
```

**3. LibreOffice Not Found**
```bash
# Verify in container
docker exec -it <container> libreoffice --version
```

**4. FFmpeg Missing**
```bash
# Check FFmpeg installation
docker exec -it <container> ffmpeg -version
```

### Debug Mode

Enable verbose logging:
```bash
export LOG_LEVEL=debug
npm run dev
```

## Development

### Local Development with Hot Reload

```bash
cd file-conversion-service
npm run dev  # Uses ts-node-dev for hot reload
```

### Testing

```bash
# Unit tests
npm test

# Integration tests with Docker
docker-compose -f docker-compose.test.yml up --abort-on-container-exit
```

## Performance Optimization

### File Service
- LibreOffice headless mode
- Parallel processing with BullMQ
- Temp file cleanup after 24h

### Media Service
- FFmpeg hardware acceleration (when available)
- Concurrent job limit: 2 (CPU intensive)
- Streaming for large files

### Filter Service
- Sharp library (libvips) for fast processing
- Higher concurrency: 10 jobs
- In-memory processing for small images

## Cost Estimation

### AWS Monthly Costs (Approximate)

**Small Setup (< 1000 conversions/day)**
- 3 × t3.medium instances: $75
- ALB: $20
- ElastiCache t3.micro: $15
- Data transfer: $10
- **Total: ~$120/month**

**Medium Setup (< 10000 conversions/day)**
- 6 × t3.large instances: $300
- ALB: $20
- ElastiCache t3.small: $30
- Data transfer: $50
- **Total: ~$400/month**

## Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Test locally with Docker Compose
5. Submit pull request

## License

MIT
