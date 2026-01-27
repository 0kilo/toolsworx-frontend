# Unified Conversion Service

Single containerized backend service that handles all file conversions, media conversions, and filter operations.

## Features

- **File Conversion Service** - Documents, spreadsheets, data formats
- **Media Conversion Service** - Video, audio, image processing
- **Filter Service** - Image filters, audio effects, data formatting

## Endpoints

### File Conversion
- `POST /api/convert` - Convert file
- `GET /api/status/:jobId` - Check conversion status
- `GET /api/download/:jobId` - Download converted file

### Media Conversion
- `POST /api/media/convert` - Convert media file
- `GET /api/media/status/:jobId` - Check conversion status
- `GET /api/media/download/:jobId` - Download converted media

### Filter Service
- `POST /api/filter` - Apply filter to file
- `GET /api/filter/status/:jobId` - Check filter status
- `GET /api/filter/download/:jobId` - Download filtered file

### Health & Monitoring
- `GET /health` - Service health check
- `GET /ready` - Readiness check (for load balancers)
- `GET /metrics` - Prometheus metrics endpoint

## Environment Variables

```bash
PORT=3010                          # Server port
NODE_ENV=production                # Environment (development/production)
LOG_LEVEL=info                     # Logging level (debug/info/warn/error)
CORS_ORIGIN=http://localhost:3000  # Frontend URL
MAX_FILE_SIZE=524288000            # Max upload size (500MB)
TEMP_DIR=/tmp/uploads              # Upload directory
LIBRE_OFFICE_PATH=/usr/bin/libreoffice  # LibreOffice binary path
```

## Running Locally

### Development Mode
```bash
npm install
npm run dev
```

### Production Mode
```bash
npm install --production
npm start
```

### Docker
```bash
docker build -t us-east5-docker.pkg.dev/toolsworx-344a5/toolsworx-backend/unified-service:latest .
docker push us-east5-docker.pkg.dev/toolsworx-344a5/toolsworx-backend/unified-service:latest
docker run -p 3010:3010 \
  -e CORS_ORIGIN=http://localhost:3000 \
  us-east5-docker.pkg.dev/toolsworx-344a5/toolsworx-backend/unified-service:latest
```

### Bundle
```bash
scripts/bundle-unified-service.sh
```

### Docker Compose
```bash
cd backend/unified-service
docker compose up -d
```

## Testing

```bash
# Health check
curl http://localhost:3010/health

# File conversion
curl -X POST http://localhost:3010/api/convert \
  -F "file=@test.pdf" \
  -F "targetFormat=docx"

# Media conversion
curl -X POST http://localhost:3010/api/media/convert \
  -F "file=@video.mp4" \
  -F "targetFormat=webm"

# Apply filter
curl -X POST http://localhost:3010/api/filter \
  -F "file=@image.jpg" \
  -F "filterType=grayscale"
```
curl -i https://api.toolsworx.com/api/status/3
curl -i -X POST \
    -F "file=@$HOME/Documents/personal/IRS_EIN.pdf" \
    -F "targetFormat=docx" \
    -H "Origin: https://toolsworx.com" \
    https://api.toolsworx.com/api/convert
curl -i -X POST \
    -F "file=@$HOME/Documents/personal/IRS_EIN.pdf" \
    -F "targetFormat=docx" \
    -H "Origin: https://toolsworx.com" \
    http://toolsworx.us-east-2.elasticbeanstalk.com/api/convert

curl -i https://api.toolsworx.com/api/status/3
scp -i "toolsworx.pem" ~/Documents/personal/IRS_EIN.pdf  ec2-user@ec2-3-128-8-79.us-east-2.compute.amazonaws.com:/home/ec2-user/
sudo docker cp ~/IRS_EIN.pdf $(sudo docker ps --filter name=unified-service -q):/tmp/IRS_EIN.pdf

 HOME=/tmp/lo-profile TMPDIR=/tmp/lo-profile libreoffice --headless --nologo --nofirststartwizard --norestore --nolockcheck --nodefault \
    --infilter=writer_pdf_import \
    --convert-to docx \
    --outdir /tmp/out /tmp/IRS_EIN.pdf
## Architecture

```
┌─────────────────────────────────────┐
│   Unified Conversion Service        │
│         (Port 3010)                 │
├─────────────────────────────────────┤
│                                     │
│  ┌──────────────────────────────┐  │
│  │  File Conversion Endpoints   │  │
│  │  /api/convert               │  │
│  │  /api/status/:id            │  │
│  │  /api/download/:id          │  │
│  └──────────────────────────────┘  │
│                                     │
│  ┌──────────────────────────────┐  │
│  │  Media Conversion Endpoints  │  │
│  │  /api/media/convert         │  │
│  │  /api/media/status/:id      │  │
│  │  /api/media/download/:id    │  │
│  └──────────────────────────────┘  │
│                                     │
│  ┌──────────────────────────────┐  │
│  │  Filter Service Endpoints    │  │
│  │  /api/filter                │  │
│  │  /api/filter/status/:id     │  │
│  │  /api/filter/download/:id   │  │
│  └──────────────────────────────┘  │
│                                     │
└─────────────────────────────────────┘
```

## Production Deployment

### AWS Elastic Beanstalk

1. Create application:
```bash
eb init -p docker unified-conversion-service
```

2. Create environment:
```bash
eb create production --instance-type t3.small
```

3. Deploy:
```bash
eb deploy
```

### Environment Variables (Production)

Set these in AWS Elastic Beanstalk environment configuration:

```
PORT=3010
NODE_ENV=production
CORS_ORIGIN=https://your-frontend-domain.com
AWS_REGION=us-east-1
S3_BUCKET_NAME=your-conversion-bucket
```

## Resource Requirements

- **CPU:** 0.5-2.0 vCPUs
- **Memory:** 1-4 GB RAM
- **Storage:** Minimal (temp files auto-deleted)
- **Network:** Outbound for external API calls

## Monitoring

### Health Check Endpoint

The service provides health status at `/health`:

```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "service": "unified-conversion-service",
  "uptime": 3600,
  "memory": {...},
  "redis": "connected",
  "services": {
    "file_conversion": "operational",
    "media_conversion": "operational",
    "filter_service": "operational"
  }
}
```

### Prometheus Metrics

The service exposes Prometheus metrics at `/metrics`:

**Available Metrics:**
- `http_request_duration_seconds` - HTTP request latency histogram
- `conversions_total` - Total conversions processed (by type and status)
- `active_jobs` - Currently active conversion jobs (by type)
- `process_*` - Standard Node.js process metrics (CPU, memory, etc.)

**Example Prometheus Configuration:**
```yaml
scrape_configs:
  - job_name: 'unified-conversion-service'
    static_configs:
      - targets: ['localhost:3010']
    metrics_path: '/metrics'
    scrape_interval: 15s
```

### Logging

The service uses structured JSON logging with Pino:
- Development: Pretty-printed, colorized logs
- Production: JSON formatted logs for log aggregation

### Rate Limiting

- **Window:** 15 minutes
- **Max Requests:** 100 per IP address
- **Response:** 429 Too Many Requests when limit exceeded

## License

MIT
