# Unified Conversion Service

Single containerized backend service that handles all file conversions, media conversions, and filter operations.

## Features

- **File Conversion Service** - Documents, spreadsheets, data formats
- **Media Conversion Service** - Video, audio, image processing
- **Filter Service** - Image filters, audio effects, data formatting

## Endpoints

### File Conversion
- `POST /api/file/convert` - Convert file (preferred)
- `POST /api/convert` - Convert file (alias)
- `GET /api/file/status/:jobId` - Check conversion status (preferred)
- `GET /api/status/:jobId` - Check conversion status (alias)
- `GET /api/file/download/:jobId` - Download converted file (preferred)
- `GET /api/download/:jobId` - Download converted file (alias)

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
TURNSTILE_SECRET_KEY=              # Cloudflare Turnstile secret (enables verification)
MAX_FILE_SIZE=524288000            # Max upload size (500MB)
MAX_MEDIA_SIZE=838860800           # Max media upload size (800MB)
MAX_AUDIO_SIZE=209715200           # Max audio upload size (200MB)
TEMP_DIR=/tmp/uploads              # Upload directory
LIBRE_OFFICE_PATH=/usr/bin/libreoffice  # LibreOffice binary path
FFMPEG_PATH=/usr/bin/ffmpeg        # FFmpeg binary path
CONVERSION_LIMIT_NOAUTH=3          # Anonymous conversions per window
CONVERSION_WINDOW_HOURS=24         # Rate limit window
GLOBAL_RATE_MAX=200                # Global rate limit
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
curl -X POST http://localhost:3010/api/file/convert \
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
## Architecture

```
┌─────────────────────────────────────┐
│   Unified Conversion Service        │
│         (Port 3010)                 │
├─────────────────────────────────────┤
│                                     │
│  ┌──────────────────────────────┐  │
│  │  File Conversion Endpoints   │  │
│  │  /api/file/convert          │  │
│  │  /api/file/status/:id       │  │
│  │  /api/file/download/:id     │  │
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

Deploy to your container platform (Cloud Run recommended). Ensure environment
variables are set for CORS, size limits, and rate limiting.

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

- **Global:** 15 minutes, 200 requests per IP (express-rate-limit)
- **Anonymous conversions:** 3 per 24 hours (Firestore-backed, keyed by IP + user-agent fingerprint)
- **API keys:** unlimited when `API_KEYS` contains the provided key
- **Response:** 429 with `resetAt` when daily limit exceeded

## License

MIT
