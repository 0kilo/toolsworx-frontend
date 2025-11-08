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

### Health Check
- `GET /health` - Service health check

## Environment Variables

```bash
PORT=3000                          # Server port
NODE_ENV=production                # Environment
CORS_ORIGIN=http://localhost:3000  # Frontend URL
REDIS_URL=redis://redis:6379       # Redis connection
MAX_FILE_SIZE=524288000            # Max upload size (500MB)
TEMP_DIR=/tmp/uploads              # Upload directory
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
docker build -t unified-service .
docker run -p 3000:3000 \
  -e CORS_ORIGIN=http://localhost:3000 \
  unified-service
```

### Docker Compose
```bash
cd backend
docker-compose up -d
```

## Testing

```bash
# Health check
curl http://localhost:3000/health

# File conversion
curl -X POST http://localhost:3000/api/convert \
  -F "file=@test.pdf" \
  -F "targetFormat=docx"

# Media conversion
curl -X POST http://localhost:3000/api/media/convert \
  -F "file=@video.mp4" \
  -F "targetFormat=webm"

# Apply filter
curl -X POST http://localhost:3000/api/filter \
  -F "file=@image.jpg" \
  -F "filterType=grayscale"
```

## Architecture

```
┌─────────────────────────────────────┐
│   Unified Conversion Service        │
│         (Port 3000)                 │
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
          ↓
    ┌─────────┐
    │  Redis  │
    └─────────┘
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
PORT=3000
NODE_ENV=production
CORS_ORIGIN=https://your-frontend-domain.com
REDIS_URL=redis://your-redis-url:6379
AWS_REGION=us-east-1
S3_BUCKET_NAME=your-conversion-bucket
```

## Resource Requirements

- **CPU:** 0.5-2.0 vCPUs
- **Memory:** 1-4 GB RAM
- **Storage:** Minimal (temp files auto-deleted)
- **Network:** Outbound for external API calls

## Monitoring

The service provides metrics at `/health`:

```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 3600,
  "memory": {...},
  "services": {
    "file_conversion": "operational",
    "media_conversion": "operational",
    "filter_service": "operational"
  }
}
```

## License

MIT
