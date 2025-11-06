# TOOLS WORX - Technology Stack

## Core Technologies

### Frontend Framework
- **Next.js 14.2.0** - React framework with App Router
- **React 18.3.1** - UI library with modern hooks
- **TypeScript 5.4.0** - Type-safe JavaScript development

### Styling & UI
- **Tailwind CSS 3.4.1** - Utility-first CSS framework
- **shadcn/ui** - Modern React component library
- **Radix UI** - Accessible component primitives
- **Lucide React** - Icon library with 1000+ icons
- **CSS Variables** - Theme system for dark mode support

### Backend Services
- **Node.js** - JavaScript runtime for microservices
- **Express.js** - Web framework for API services
- **FFmpeg** - Media processing (audio/video conversion)
- **Sharp** - Image processing and optimization
- **LibreOffice** - Document conversion (PDF, Word, Excel)

### Data & Storage
- **PostgreSQL** - Primary database (AWS RDS)
- **Redis** - Caching and session storage (AWS ElastiCache)
- **Amazon S3** - File storage and static assets
- **Math.js 12.4.0** - Mathematical expression parsing

### Development Tools
- **ESLint** - Code linting and formatting
- **Autoprefixer** - CSS vendor prefixing
- **PostCSS** - CSS processing pipeline

## Infrastructure Stack

### Cloud Platform
- **AWS** - Primary cloud provider
- **Cloudflare** - CDN, DNS, and WAF protection

### Container Orchestration
- **Docker** - Application containerization
- **AWS ECS Fargate** - Serverless container hosting
- **Amazon ECR** - Container image registry

### Infrastructure as Code
- **Terraform** - Infrastructure provisioning
- **GitHub Actions** - CI/CD pipeline automation

### Monitoring & Observability
- **AWS CloudWatch** - Logging and metrics
- **Application Load Balancer** - Traffic distribution and health checks

## Development Environment

### Required Software
```bash
# Node.js and package manager
node >= 18.0.0
npm >= 9.0.0

# Infrastructure tools
terraform >= 1.5.0
docker >= 20.0.0
aws-cli >= 2.0.0

# Optional development tools
git >= 2.30.0
```

### Environment Setup
```bash
# Install dependencies
npm install

# Copy environment template
cp .env.local.example .env.local

# Start development server
npm run dev

# Build for production
npm run build
npm start
```

### Development Scripts
```json
{
  "dev": "next dev",           // Development server (port 3000)
  "build": "next build",       // Production build
  "start": "next start",       // Production server
  "lint": "next lint"          // Code linting
}
```

## Backend Services Configuration

### File Conversion Service
```dockerfile
# Node.js with LibreOffice for document processing
FROM node:18-alpine
RUN apk add --no-cache libreoffice
```

### Media Conversion Service
```dockerfile
# Node.js with FFmpeg for audio/video processing
FROM node:18-alpine
RUN apk add --no-cache ffmpeg
```

### Filter Service
```dockerfile
# Node.js with Sharp for image processing
FROM node:18-alpine
RUN apk add --no-cache vips-dev
```

## Database Schema

### Conversion Jobs Table
```sql
CREATE TABLE conversion_jobs (
  id UUID PRIMARY KEY,
  type VARCHAR(50) NOT NULL,
  status VARCHAR(20) NOT NULL,
  input_file_url TEXT,
  output_file_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP,
  error_message TEXT
);
```

### Rate Limiting (Redis)
```
Key Pattern: rate_limit:{ip_address}:{endpoint}
TTL: 3600 seconds (1 hour)
Value: Request count
```

## API Architecture

### REST Endpoints
```
POST /api/convert          # File conversion
GET  /api/status/{jobId}   # Conversion status
GET  /api/download/{jobId} # Download result
POST /api/filter           # Apply filters
POST /api/media            # Media processing
```

### Request/Response Format
```typescript
// Conversion Request
interface ConversionRequest {
  type: string;           // "pdf-to-word", "jpg-to-png"
  file: File;             // Input file
  options?: object;       // Conversion options
}

// Conversion Response
interface ConversionResponse {
  jobId: string;          // Unique job identifier
  status: "pending" | "processing" | "completed" | "failed";
  downloadUrl?: string;   // Result file URL
  error?: string;         // Error message if failed
}
```

## Performance Optimizations

### Frontend Optimizations
- **Code Splitting** - Dynamic imports for converter pages
- **Image Optimization** - Next.js automatic image optimization
- **Static Generation** - Pre-rendered category and tool pages
- **Bundle Analysis** - Webpack bundle analyzer integration

### Backend Optimizations
- **Connection Pooling** - PostgreSQL connection management
- **Redis Caching** - API response caching (5-minute TTL)
- **File Streaming** - Large file upload/download streaming
- **Auto Scaling** - ECS Fargate CPU/memory-based scaling

### CDN Configuration
```javascript
// Cloudflare caching rules
{
  "static_assets": "1 year",      // Images, CSS, JS
  "api_responses": "5 minutes",   // Conversion results
  "html_pages": "1 hour"          // Tool pages
}
```

## Security Configuration

### Environment Variables
```bash
# Database
DATABASE_URL=postgresql://user:pass@host:5432/db
REDIS_URL=redis://host:6379

# AWS Services
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...
S3_BUCKET_NAME=convert-all-files

# Application
NEXTAUTH_SECRET=random-secret-key
NEXTAUTH_URL=https://your-domain.com
```

### Security Headers
```javascript
// next.config.js security headers
{
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()"
}
```

## Deployment Configuration

### Production Build
```bash
# Build optimized production bundle
npm run build

# Docker image build
docker build -t convert-all-frontend .
docker build -t convert-all-backend ./backend/file-conversion-service
```

### AWS ECS Task Definition
```json
{
  "family": "convert-all-frontend",
  "cpu": "512",
  "memory": "1024",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "executionRoleArn": "arn:aws:iam::account:role/ecsTaskExecutionRole"
}
```

## Monitoring & Logging

### CloudWatch Metrics
- **Application Metrics**: Request count, response time, error rate
- **Infrastructure Metrics**: CPU, memory, disk usage
- **Business Metrics**: Conversion success rate, popular tools

### Log Aggregation
```javascript
// Structured logging format
{
  "timestamp": "2024-01-01T00:00:00Z",
  "level": "info",
  "service": "file-conversion",
  "jobId": "uuid",
  "message": "Conversion completed",
  "duration": 1500
}
```