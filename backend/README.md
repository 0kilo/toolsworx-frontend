# Backend Services

Unified backend service for all file, media, and filter conversions.

## Quick Start

### Option 1: Using startup scripts (Recommended)

```bash
# From project root
./backend/start-unified.sh

# Stop
./backend/stop-unified.sh
```

### Option 2: Using Docker Compose directly

```bash
# From backend directory
cd backend
docker compose up -d

# Stop
docker compose down
```

## Docker Compose Files

There are **TWO** docker-compose files with different purposes:

### 1. `backend/docker-compose.yml` (Production-ready)
- **Location:** `backend/docker-compose.yml`
- **Use for:** Testing production configuration locally
- **Features:**
  - Production environment variables
  - No volume mounts (uses Docker images as-is)
  - Optimized for deployment

**Run:**
```bash
cd backend
docker compose up -d
```

### 2. `docker-compose.local.yml` (Development)
- **Location:** Root directory `docker-compose.local.yml`
- **Use for:** Active development with live reload
- **Features:**
  - Development environment variables
  - Source code mounted for live changes
  - Development-friendly settings

**Run:**
```bash
# From project root
docker compose -f docker-compose.local.yml up -d

# OR use the script
./backend/start-unified.sh local
```

## Services Overview

### Unified Service
- **Port:** 3000
- **Endpoints:**
  - File conversions: `/api/convert`, `/api/status/:id`, `/api/download/:id`
  - Media conversions: `/api/media/*`
  - Filters: `/api/filter/*`
  - Health: `/health`

### Redis
- **Port:** 6379
- **Purpose:** Job queuing and caching

### Cleanup Service
- **Purpose:** Auto-delete old temp files (1 hour retention)

## Environment Variables

Create `.env` file in `backend/` directory:

```bash
PORT=3000
NODE_ENV=production
CORS_ORIGIN=http://localhost:3000
REDIS_URL=redis://redis:6379
MAX_FILE_SIZE=524288000
TEMP_DIR=/tmp/uploads
```

## Monitoring

### Health Check
```bash
curl http://localhost:3000/health
```

### View Logs
```bash
# Production setup
cd backend
docker compose logs -f unified-service

# Development setup
docker compose -f docker-compose.local.yml logs -f unified-service
```

### Check Running Services
```bash
docker compose ps
```

## Development Workflow

1. **Make changes** to `backend/unified-service/server.js`

2. **If using development mode**, changes are live-reloaded:
   ```bash
   docker compose -f docker-compose.local.yml restart unified-service
   ```

3. **If using production mode**, rebuild:
   ```bash
   cd backend
   docker compose up -d --build unified-service
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

## Troubleshooting

### Port already in use
```bash
# Stop all Docker containers
docker compose down

# Or stop specific service
docker compose stop unified-service
```

### Services won't start
```bash
# Check logs
docker compose logs unified-service

# Rebuild from scratch
docker compose down -v
docker compose up -d --build
```

### Redis connection issues
```bash
# Check Redis is running
docker compose ps redis

# Test Redis
docker compose exec redis redis-cli ping
```

## Production Deployment

See `unified-service/README.md` for AWS Elastic Beanstalk deployment instructions.

## Architecture

```
┌─────────────────────────────────────┐
│   Unified Service (Port 3000)      │
├─────────────────────────────────────┤
│  • File Conversions (/api/convert) │
│  • Media Conversions (/api/media)  │
│  • Filters (/api/filter)           │
│  • Health Check (/health)          │
└────────────┬────────────────────────┘
             │
             ↓
        ┌─────────┐
        │  Redis  │
        │  :6379  │
        └─────────┘
```

## Resource Usage

- **Memory:** 1-4 GB
- **CPU:** 0.5-2.0 vCPUs
- **Disk:** Minimal (temp files auto-deleted)

## Summary

✅ **For Production Testing:** Use `backend/docker-compose.yml`
✅ **For Active Development:** Use `docker-compose.local.yml`
✅ **Quick Start:** Use `./backend/start-unified.sh`

**Note:** This project uses Docker Compose V2 (`docker compose` command, not `docker-compose`).
