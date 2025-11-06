# TOOLS WORX - Project Structure

## Directory Architecture

### Frontend Application (`/app/`)
Next.js 14 App Router structure with category-based organization:

```
app/
├── api/                    # Backend API routes
│   ├── convert/           # File conversion endpoints
│   ├── download/          # File download handlers
│   ├── filter/            # Image/audio filter endpoints
│   ├── media/             # Media processing endpoints
│   └── status/            # Conversion status tracking
├── calculators/           # Calculator tools (10 tools)
├── dev-tools/             # Developer utilities (3 tools)
├── file-converters/       # Document conversion tools (19 tools)
├── filters/               # Image/audio/text filters (25 tools)
├── media-converters/      # Audio/video/image converters (25 tools)
├── unit-conversions/      # Measurement converters (6 tools)
├── category/[id]/         # Dynamic category pages
├── globals.css            # Global styles and CSS variables
├── layout.tsx             # Root layout with navigation
└── page.tsx               # Homepage with tool gallery
```

### Backend Services (`/backend/`)
Microservices architecture for scalable processing:

```
backend/
├── file-conversion-service/    # Document processing (PDF, Word, Excel)
│   ├── src/
│   │   ├── processors/        # File format processors
│   │   ├── routes/            # API endpoints
│   │   └── utils/             # Helper functions
│   └── Dockerfile             # Container configuration
├── media-conversion-service/   # Audio/video processing (FFmpeg)
│   ├── src/
│   │   ├── processors/        # Media format processors
│   │   └── routes/            # Media API endpoints
│   └── Dockerfile
├── filter-service/            # Image/audio effects processing
│   ├── src/
│   │   ├── filters/           # Effect processors
│   │   └── routes/            # Filter API endpoints
│   └── Dockerfile
└── docker-compose.yml         # Local development setup
```

### Component Library (`/components/`)
Reusable UI components with shadcn/ui foundation:

```
components/
├── ads/                   # AdSense integration components
├── layout/                # Header, footer, navigation
├── shared/                # Common converter components
│   ├── converter-card.tsx # Tool display cards
│   └── file-dropzone.tsx  # File upload interface
└── ui/                    # Base UI components (shadcn/ui)
    ├── button.tsx         # Button variants
    ├── card.tsx           # Card layouts
    ├── input.tsx          # Form inputs
    └── [other-ui-components]
```

### Configuration & Types (`/config/`, `/types/`)
Centralized configuration and TypeScript definitions:

```
config/
├── site.ts               # Site metadata, AdSense config
└── theme.ts              # Theme colors and design tokens

types/
└── converter.ts          # TypeScript interfaces for converters
```

### Business Logic (`/lib/`)
Core functionality and service integrations:

```
lib/
├── categories/           # Category-specific converter registries
│   ├── calculators/     # Calculator tool definitions
│   ├── file-converters/ # File conversion tool registry
│   ├── media-converters/# Media tool registry
│   └── [other-categories]
├── services/            # API client and service layers
│   ├── api-client.ts    # HTTP client configuration
│   ├── conversion-service.ts # Conversion API wrapper
│   └── index.ts         # Service exports
├── categories.ts        # Main category definitions
├── registry.ts          # Global tool registry
├── rate-limit.ts        # API rate limiting
└── utils.ts             # Utility functions
```

### Infrastructure (`/terraform/`, `/scripts/`)
AWS deployment and automation:

```
terraform/
├── compute/             # ECS Fargate services
├── data/                # RDS, ElastiCache, S3
├── monitoring/          # CloudWatch, alerts
├── networking/          # VPC, ALB, security groups
├── main.tf              # Root Terraform configuration
└── prod.tfvars          # Production variables

scripts/
├── deploy.sh            # Automated deployment
├── setup-infrastructure.sh # AWS infrastructure setup
├── rollback.sh          # Deployment rollback
└── generate-pages.sh    # Static page generation
```

### MCP Integration (`/mcp-server/`)
Model Context Protocol server for AI tool integration:

```
mcp-server/
├── src/
│   ├── tools/           # MCP tool definitions
│   │   └── conversion-tools.ts # Conversion tool exports
│   └── index.ts         # MCP server entry point
├── package.json         # Node.js dependencies
└── tsconfig.json        # TypeScript configuration
```

## Core Components & Relationships

### Tool Registration System
1. **Category Registries** (`/lib/categories/`) define tools by type
2. **Global Registry** (`/lib/registry.ts`) aggregates all tools
3. **Dynamic Pages** (`/app/[category]/`) render tools automatically
4. **Homepage** (`/app/page.tsx`) displays tool gallery from registry

### Conversion Flow Architecture
1. **Frontend Upload** → File dropzone component
2. **API Route** → Next.js API handlers (`/app/api/`)
3. **Backend Service** → Microservice processing
4. **Result Delivery** → Download links or direct display

### State Management Pattern
- **Client-side**: React state for UI interactions
- **Server-side**: Next.js API routes for backend communication
- **Caching**: Redis for conversion results and rate limiting
- **Storage**: S3 for temporary file storage

## Architectural Patterns

### Modular Converter System
Each converter follows a consistent pattern:
- **Registry Entry**: Metadata, routing, and categorization
- **Page Component**: UI for the specific conversion tool
- **API Handler**: Backend processing logic
- **Service Integration**: Microservice or client-side processing

### Microservices Communication
- **API Gateway**: Next.js API routes act as gateway
- **Service Discovery**: Environment-based service URLs
- **Error Handling**: Consistent error responses across services
- **Monitoring**: CloudWatch integration for all services

### SEO Optimization Structure
- **Static Generation**: Category and tool pages pre-rendered
- **Dynamic Metadata**: Tool-specific meta tags and Open Graph
- **Semantic HTML**: Proper heading hierarchy and structure
- **Performance**: Optimized images, lazy loading, code splitting

### Scalability Design
- **Horizontal Scaling**: ECS Fargate auto-scaling
- **Database Scaling**: RDS read replicas, connection pooling
- **Caching Strategy**: Redis for API responses, CloudFront for static assets
- **Load Balancing**: Application Load Balancer with health checks