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
docker-compose up -d

# Stop
docker-compose down
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
docker-compose up -d
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
docker-compose -f docker-compose.local.yml up -d

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

## Summary

✅ **For Production Testing:** Use `backend/docker-compose.yml`
✅ **For Active Development:** Use `docker-compose.local.yml`
✅ **Quick Start:** Use `./backend/start-unified.sh`
