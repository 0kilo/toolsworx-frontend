# File Conversion Service

Microservice for document and file format conversions with ephemeral storage, rate limiting, and background job processing.

## Features

- **Document Conversions**: PDF ↔ Word (DOCX), PDF ↔ PowerPoint, Word ↔ PowerPoint
- **Spreadsheet Conversions**: Excel (XLSX) ↔ CSV, Excel ↔ JSON
- **Archive Operations**: ZIP, TAR, 7Z creation and extraction
- **Text Formats**: JSON ↔ YAML ↔ XML, Base64 encoding/decoding
- **Rate Limiting**: Configurable per-user tier limits
- **Background Processing**: Async job queue with progress tracking
- **Auto-cleanup**: Temporary files automatically removed

## Tech Stack

- **Runtime**: Node.js 20+ with TypeScript
- **Framework**: Fastify
- **Queue**: BullMQ with Redis
- **Document Processing**: LibreOffice (headless), Pandoc
- **Monitoring**: Prometheus metrics, health checks

## Installation

### Local Development

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Build TypeScript
npm run build

# Start development server
npm run dev
```

### Docker

```bash
# Build image
docker build -t file-conversion-service .

# Run container
docker run -p 3000:3000 \
  -e REDIS_URL=redis://host.docker.internal:6379 \
  file-conversion-service
```

### Docker Compose

```bash
# Start all services (from backend/ directory)
docker-compose up -d
```

## API Endpoints

### Convert File

```http
POST /api/convert
Content-Type: multipart/form-data

file: <binary>
targetFormat: docx|pdf|csv|xlsx|zip
options: {"preserveFormatting": true}
```

**Response:**
```json
{
  "jobId": "uuid",
  "status": "queued",
  "estimatedTime": "2-5 minutes",
  "statusUrl": "/api/status/uuid",
  "downloadUrl": "/api/download/uuid"
}
```

### Check Status

```http
GET /api/status/:jobId
```

**Response:**
```json
{
  "jobId": "uuid",
  "status": "completed",
  "progress": 100,
  "createdAt": "2024-01-01T00:00:00Z",
  "finishedAt": "2024-01-01T00:02:00Z",
  "result": {
    "outputPath": "/tmp/...",
    "filename": "converted.docx",
    "size": 12345
  }
}
```

### Download File

```http
GET /api/download/:id
```

Returns the converted file as a binary download.

### Health Check

```http
GET /health
```

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00Z",
  "services": [
    {"service": "libreoffice", "status": "healthy"},
    {"service": "disk", "status": "healthy"},
    {"service": "memory", "status": "healthy"}
  ]
}
```

### Metrics

```http
GET /metrics
```

Returns Prometheus-format metrics.

## Supported Conversions

### Documents
- PDF → DOCX, PPTX, TXT, HTML
- DOCX → PDF, PPTX, TXT, HTML
- PPTX → PDF, DOCX

### Spreadsheets
- XLSX → CSV, JSON
- CSV → XLSX, JSON
- XLS → XLSX, CSV

### Archives
- Create ZIP from files
- Extract ZIP, TAR, 7Z
- Convert between archive formats

## Rate Limits

### Anonymous Users
- 20 requests/hour
- Max file size: 25MB
- 1 concurrent job
- Limited formats

### Registered Users
- 100 requests/hour
- Max file size: 100MB
- 3 concurrent jobs
- All formats

### Premium Users
- 500 requests/hour
- Max file size: 500MB
- 10 concurrent jobs
- Priority processing

## Configuration

Environment variables:

- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Environment (development|production)
- `REDIS_URL`: Redis connection URL
- `MAX_FILE_SIZE`: Maximum upload size in bytes
- `TEMP_DIR`: Temporary file directory
- `LIBRE_OFFICE_PATH`: Path to LibreOffice binary
- `PANDOC_PATH`: Path to Pandoc binary

## AWS Elastic Beanstalk Deployment

### Prerequisites

1. Install EB CLI:
```bash
pip install awsebcli
```

2. Initialize EB application:
```bash
eb init -p docker file-conversion-service
```

3. Create environment:
```bash
eb create file-conversion-prod \
  --instance-type t3.medium \
  --elb-type application
```

4. Set environment variables:
```bash
eb setenv \
  NODE_ENV=production \
  REDIS_URL=redis://your-redis-host:6379 \
  MAX_FILE_SIZE=524288000
```

5. Deploy:
```bash
eb deploy
```

### Elastic Beanstalk Configuration

The service includes `.ebextensions/` for:
- Redis installation
- LibreOffice installation
- Monitoring and logging
- Auto-scaling configuration

## Monitoring

### Prometheus Metrics

Available at `/metrics`:

- `file_conversions_total`: Total conversions by type and status
- `file_conversion_duration_seconds`: Conversion duration histogram
- `file_size_bytes`: File size histogram
- `memory_usage_bytes`: Current memory usage

### Health Checks

- **Liveness**: `/health` - Checks LibreOffice, disk, memory
- **Readiness**: `/ready` - Quick readiness check for load balancers

## Development

```bash
# Run tests
npm test

# Lint code
npm run lint

# Watch mode
npm run dev
```

## License

MIT
