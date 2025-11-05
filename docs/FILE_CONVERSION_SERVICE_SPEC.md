# File Conversion Service Specification

## Overview

A self-contained microservice for document and file format conversions with ephemeral storage, MCP compatibility, and robust rate limiting. Files are processed in-memory or temporary storage and immediately available for download without persistent storage.

---

## 🎯 Service Scope

### Supported Conversions

#### Document Formats
- **PDF ↔ Word (DOCX/DOC)**
- **PDF ↔ PowerPoint (PPTX/PPT)**
- **Word ↔ PowerPoint**
- **PDF ↔ Text (TXT)**
- **HTML ↔ PDF**
- **Markdown ↔ PDF/HTML/DOCX**

#### Spreadsheet Formats
- **Excel (XLSX/XLS) ↔ CSV**
- **Excel ↔ Google Sheets (JSON)**
- **CSV ↔ JSON**
- **CSV ↔ XML**

#### Archive Formats
- **ZIP ↔ TAR**
- **ZIP ↔ RAR (extract only)**
- **7Z ↔ ZIP**
- **Create archives from multiple files**

#### Text & Data Formats
- **JSON ↔ YAML**
- **JSON ↔ XML**
- **Base64 encode/decode**
- **Text encoding conversions (UTF-8, ASCII, etc.)**

---

## 🏗️ Architecture

### Container Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                File Conversion Service                       │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                 API Gateway                           │  │
│  │  • Rate limiting (Redis)                             │  │
│  │  • File validation                                   │  │
│  │  • Request routing                                   │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Conversion Engine                        │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │  │
│  │  │ LibreOffice │  │   Pandoc    │  │ Archive     │  │  │
│  │  │ Processor   │  │ Processor   │  │ Processor   │  │  │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Ephemeral Storage                        │  │
│  │  • In-memory processing (< 50MB)                     │  │
│  │  • Temp disk storage (> 50MB)                        │  │
│  │  • Auto-cleanup (5 min TTL)                          │  │
│  │  • Download URLs (1 hour TTL)                        │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                 MCP Interface                         │  │
│  │  • Tool registration                                 │  │
│  │  • Parameter validation                              │  │
│  │  • Response formatting                               │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Technology Stack
- **Runtime**: Node.js 20+ with TypeScript
- **Framework**: Fastify (high performance)
- **Conversion Libraries**:
  - LibreOffice (headless) - Document conversions
  - Pandoc - Markdown/text conversions
  - node-xlsx - Excel processing
  - archiver/unzipper - Archive handling
- **Storage**: In-memory + temp filesystem
- **Cache**: Redis (rate limiting, session data)
- **Validation**: File type detection, size limits

---

## 🔒 Rate Limiting & Security

### Rate Limits by User Tier
```typescript
interface RateLimits {
  anonymous: {
    requests_per_hour: 20
    max_file_size_mb: 25
    concurrent_conversions: 1
    allowed_formats: ['pdf', 'docx', 'txt', 'csv', 'json']
  }
  
  registered: {
    requests_per_hour: 100
    max_file_size_mb: 100
    concurrent_conversions: 3
    allowed_formats: 'all'
  }
  
  premium: {
    requests_per_hour: 500
    max_file_size_mb: 500
    concurrent_conversions: 10
    allowed_formats: 'all'
    priority_processing: true
  }
}
```

### Security Measures
```typescript
class FileSecurityValidator {
  private allowedMimeTypes = {
    'pdf': ['application/pdf'],
    'docx': ['application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    'doc': ['application/msword'],
    'xlsx': ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
    'csv': ['text/csv', 'application/csv'],
    'txt': ['text/plain'],
    'json': ['application/json'],
    'xml': ['application/xml', 'text/xml']
  }
  
  async validateFile(buffer: Buffer, filename: string): Promise<ValidationResult> {
    // File signature validation
    const signature = this.getFileSignature(buffer)
    const detectedType = this.detectFileType(signature)
    
    // MIME type validation
    const extension = path.extname(filename).toLowerCase().slice(1)
    if (!this.allowedMimeTypes[extension]) {
      throw new SecurityError(`File type not supported: ${extension}`)
    }
    
    // Size validation
    if (buffer.length > this.maxFileSize) {
      throw new SecurityError(`File too large: ${buffer.length} bytes`)
    }
    
    // Content validation (basic malware detection)
    await this.scanForMaliciousContent(buffer)
    
    return { valid: true, type: detectedType }
  }
}
```

---

## 📁 Conversion Implementations

### PDF ↔ Word Conversion
```typescript
class PDFWordConverter {
  private libreOfficePath = '/usr/bin/libreoffice'
  
  async convertPDFToWord(pdfBuffer: Buffer): Promise<Buffer> {
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'pdf-convert-'))
    const inputPath = path.join(tempDir, 'input.pdf')
    const outputDir = path.join(tempDir, 'output')
    
    try {
      // Write input file
      await fs.writeFile(inputPath, pdfBuffer)
      
      // Convert using LibreOffice
      await this.executeLibreOffice([
        '--headless',
        '--convert-to', 'docx',
        '--outdir', outputDir,
        inputPath
      ])
      
      // Read output file
      const outputPath = path.join(outputDir, 'input.docx')
      const outputBuffer = await fs.readFile(outputPath)
      
      return outputBuffer
    } finally {
      // Cleanup temp files
      await fs.rm(tempDir, { recursive: true, force: true })
    }
  }
  
  async convertWordToPDF(docxBuffer: Buffer): Promise<Buffer> {
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'word-convert-'))
    const inputPath = path.join(tempDir, 'input.docx')
    const outputDir = path.join(tempDir, 'output')
    
    try {
      await fs.writeFile(inputPath, docxBuffer)
      
      await this.executeLibreOffice([
        '--headless',
        '--convert-to', 'pdf',
        '--outdir', outputDir,
        inputPath
      ])
      
      const outputPath = path.join(outputDir, 'input.pdf')
      return await fs.readFile(outputPath)
    } finally {
      await fs.rm(tempDir, { recursive: true, force: true })
    }
  }
  
  private async executeLibreOffice(args: string[]): Promise<void> {
    return new Promise((resolve, reject) => {
      const process = spawn(this.libreOfficePath, args, {
        timeout: 60000, // 1 minute timeout
        stdio: 'pipe'
      })
      
      process.on('close', (code) => {
        if (code === 0) resolve()
        else reject(new Error(`LibreOffice exited with code ${code}`))
      })
      
      process.on('error', reject)
    })
  }
}
```

### Excel ↔ CSV Conversion
```typescript
class ExcelCSVConverter {
  async excelToCSV(xlsxBuffer: Buffer, sheetName?: string): Promise<Buffer> {
    const workbook = XLSX.read(xlsxBuffer, { type: 'buffer' })
    
    // Use specified sheet or first sheet
    const sheet = sheetName 
      ? workbook.Sheets[sheetName]
      : workbook.Sheets[workbook.SheetNames[0]]
    
    if (!sheet) {
      throw new Error(`Sheet not found: ${sheetName || 'first sheet'}`)
    }
    
    const csv = XLSX.utils.sheet_to_csv(sheet)
    return Buffer.from(csv, 'utf-8')
  }
  
  async csvToExcel(csvBuffer: Buffer, sheetName = 'Sheet1'): Promise<Buffer> {
    const csvText = csvBuffer.toString('utf-8')
    const workbook = XLSX.utils.book_new()
    const worksheet = XLSX.utils.aoa_to_sheet(
      csvText.split('\n').map(row => row.split(','))
    )
    
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName)
    
    const xlsxBuffer = XLSX.write(workbook, { 
      type: 'buffer', 
      bookType: 'xlsx' 
    })
    
    return xlsxBuffer
  }
}
```

### Archive Processing
```typescript
class ArchiveProcessor {
  async createZip(files: FileEntry[]): Promise<Buffer> {
    const archive = archiver('zip', { zlib: { level: 9 } })
    const chunks: Buffer[] = []
    
    return new Promise((resolve, reject) => {
      archive.on('data', (chunk) => chunks.push(chunk))
      archive.on('end', () => resolve(Buffer.concat(chunks)))
      archive.on('error', reject)
      
      files.forEach(file => {
        archive.append(file.content, { name: file.name })
      })
      
      archive.finalize()
    })
  }
  
  async extractZip(zipBuffer: Buffer): Promise<FileEntry[]> {
    const zip = new StreamZip.async({ buffer: zipBuffer })
    const entries = await zip.entries()
    const files: FileEntry[] = []
    
    for (const entry of Object.values(entries)) {
      if (!entry.isDirectory) {
        const content = await zip.entryData(entry)
        files.push({
          name: entry.name,
          content: content,
          size: entry.size
        })
      }
    }
    
    await zip.close()
    return files
  }
}
```

---

## 🔌 MCP Tool Definitions

### Document Conversion Tools
```typescript
const documentTools: MCPTool[] = [
  {
    name: "pdf-to-word",
    description: "Convert PDF documents to Word format",
    inputSchema: {
      type: "object",
      properties: {
        fileData: {
          type: "string",
          description: "Base64 encoded PDF file or file URL"
        },
        options: {
          type: "object",
          properties: {
            preserveFormatting: { type: "boolean", default: true },
            extractImages: { type: "boolean", default: true }
          }
        }
      },
      required: ["fileData"]
    },
    execute: async (args) => {
      const pdfBuffer = await this.getFileBuffer(args.fileData)
      const docxBuffer = await this.pdfWordConverter.convertPDFToWord(pdfBuffer)
      const downloadUrl = await this.createDownloadUrl(docxBuffer, 'converted.docx')
      
      return {
        success: true,
        downloadUrl,
        filename: 'converted.docx',
        size: docxBuffer.length,
        expiresAt: new Date(Date.now() + 3600000).toISOString() // 1 hour
      }
    }
  },
  
  {
    name: "excel-to-csv",
    description: "Convert Excel spreadsheets to CSV format",
    inputSchema: {
      type: "object",
      properties: {
        fileData: { type: "string", description: "Base64 encoded Excel file" },
        sheetName: { type: "string", description: "Specific sheet to convert" },
        includeHeaders: { type: "boolean", default: true }
      },
      required: ["fileData"]
    },
    execute: async (args) => {
      const xlsxBuffer = await this.getFileBuffer(args.fileData)
      const csvBuffer = await this.excelCSVConverter.excelToCSV(
        xlsxBuffer, 
        args.sheetName
      )
      const downloadUrl = await this.createDownloadUrl(csvBuffer, 'converted.csv')
      
      return {
        success: true,
        downloadUrl,
        filename: 'converted.csv',
        size: csvBuffer.length,
        expiresAt: new Date(Date.now() + 3600000).toISOString()
      }
    }
  },
  
  {
    name: "create-archive",
    description: "Create ZIP archive from multiple files",
    inputSchema: {
      type: "object",
      properties: {
        files: {
          type: "array",
          items: {
            type: "object",
            properties: {
              name: { type: "string" },
              data: { type: "string", description: "Base64 encoded file data" }
            },
            required: ["name", "data"]
          },
          maxItems: 50
        },
        archiveName: { type: "string", default: "archive.zip" }
      },
      required: ["files"]
    },
    execute: async (args) => {
      const fileEntries = await Promise.all(
        args.files.map(async (file) => ({
          name: file.name,
          content: Buffer.from(file.data, 'base64')
        }))
      )
      
      const zipBuffer = await this.archiveProcessor.createZip(fileEntries)
      const downloadUrl = await this.createDownloadUrl(zipBuffer, args.archiveName)
      
      return {
        success: true,
        downloadUrl,
        filename: args.archiveName,
        size: zipBuffer.length,
        fileCount: args.files.length,
        expiresAt: new Date(Date.now() + 3600000).toISOString()
      }
    }
  }
]
```

---

## 💾 Ephemeral Storage Management

### In-Memory Processing
```typescript
class EphemeralStorageManager {
  private memoryCache = new Map<string, Buffer>()
  private downloadUrls = new Map<string, DownloadEntry>()
  
  async processFile(buffer: Buffer, processor: (buf: Buffer) => Promise<Buffer>): Promise<string> {
    // For small files, process entirely in memory
    if (buffer.length < 50 * 1024 * 1024) { // 50MB
      const result = await processor(buffer)
      return this.createDownloadUrl(result)
    }
    
    // For large files, use temporary disk storage
    return this.processLargeFile(buffer, processor)
  }
  
  private async processLargeFile(buffer: Buffer, processor: (buf: Buffer) => Promise<Buffer>): Promise<string> {
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'file-convert-'))
    
    try {
      const inputPath = path.join(tempDir, 'input')
      await fs.writeFile(inputPath, buffer)
      
      const result = await processor(buffer)
      return this.createDownloadUrl(result)
    } finally {
      // Schedule cleanup
      setTimeout(() => {
        fs.rm(tempDir, { recursive: true, force: true }).catch(console.error)
      }, 5 * 60 * 1000) // 5 minutes
    }
  }
  
  createDownloadUrl(buffer: Buffer, filename?: string): string {
    const id = crypto.randomUUID()
    const entry: DownloadEntry = {
      buffer,
      filename: filename || 'converted-file',
      createdAt: Date.now(),
      expiresAt: Date.now() + 3600000 // 1 hour
    }
    
    this.downloadUrls.set(id, entry)
    
    // Schedule cleanup
    setTimeout(() => {
      this.downloadUrls.delete(id)
    }, 3600000)
    
    return `/api/download/${id}`
  }
  
  async getDownloadFile(id: string): Promise<DownloadEntry | null> {
    const entry = this.downloadUrls.get(id)
    
    if (!entry || entry.expiresAt < Date.now()) {
      this.downloadUrls.delete(id)
      return null
    }
    
    return entry
  }
}
```

### Auto-Cleanup System
```typescript
class CleanupManager {
  private cleanupInterval: NodeJS.Timeout
  
  constructor(private storageManager: EphemeralStorageManager) {
    // Run cleanup every 5 minutes
    this.cleanupInterval = setInterval(() => {
      this.performCleanup()
    }, 5 * 60 * 1000)
  }
  
  private async performCleanup() {
    // Clean expired download URLs
    for (const [id, entry] of this.storageManager.downloadUrls) {
      if (entry.expiresAt < Date.now()) {
        this.storageManager.downloadUrls.delete(id)
      }
    }
    
    // Clean temp directories older than 10 minutes
    const tempDir = os.tmpdir()
    const entries = await fs.readdir(tempDir, { withFileTypes: true })
    
    for (const entry of entries) {
      if (entry.isDirectory() && entry.name.startsWith('file-convert-')) {
        const dirPath = path.join(tempDir, entry.name)
        const stats = await fs.stat(dirPath)
        
        if (Date.now() - stats.ctimeMs > 10 * 60 * 1000) {
          await fs.rm(dirPath, { recursive: true, force: true })
        }
      }
    }
  }
  
  destroy() {
    clearInterval(this.cleanupInterval)
  }
}
```

---

## 🚀 Deployment Configuration

### Dockerfile
```dockerfile
FROM node:20-alpine

# Install LibreOffice and Pandoc
RUN apk add --no-cache \
    libreoffice \
    pandoc \
    ttf-dejavu \
    fontconfig \
    ttf-liberation

# Create app directory
WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .
RUN npm run build

# Create temp directory with proper permissions
RUN mkdir -p /tmp/file-conversions && \
    chmod 777 /tmp/file-conversions

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

EXPOSE 3000

# Run as non-root user
USER node

CMD ["node", "dist/index.js"]
```

### Docker Compose
```yaml
version: '3.8'

services:
  file-converter:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - REDIS_URL=redis://redis:6379
      - MAX_FILE_SIZE=500MB
      - TEMP_DIR=/tmp/file-conversions
    volumes:
      - /tmp:/tmp
    depends_on:
      - redis
    restart: unless-stopped
    deploy:
      resources:
        limits:
          memory: 2G
          cpus: '1.0'
        reservations:
          memory: 512M
          cpus: '0.5'

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    command: redis-server --maxmemory 256mb --maxmemory-policy allkeys-lru

volumes:
  redis_data:
```

---

## 📊 Performance & Monitoring

### Performance Metrics
```typescript
class PerformanceMonitor {
  private metrics = {
    conversionsTotal: new Counter({
      name: 'file_conversions_total',
      help: 'Total file conversions',
      labelNames: ['type', 'status']
    }),
    
    conversionDuration: new Histogram({
      name: 'file_conversion_duration_seconds',
      help: 'File conversion duration',
      labelNames: ['type'],
      buckets: [0.1, 0.5, 1, 5, 10, 30, 60]
    }),
    
    fileSize: new Histogram({
      name: 'file_size_bytes',
      help: 'Size of processed files',
      buckets: [1024, 10240, 102400, 1048576, 10485760, 104857600]
    }),
    
    memoryUsage: new Gauge({
      name: 'memory_usage_bytes',
      help: 'Current memory usage'
    })
  }
  
  recordConversion(type: string, duration: number, fileSize: number, success: boolean) {
    this.metrics.conversionsTotal.inc({ 
      type, 
      status: success ? 'success' : 'error' 
    })
    
    if (success) {
      this.metrics.conversionDuration.observe({ type }, duration)
      this.metrics.fileSize.observe(fileSize)
    }
  }
  
  updateMemoryUsage() {
    const usage = process.memoryUsage()
    this.metrics.memoryUsage.set(usage.heapUsed)
  }
}
```

### Health Checks
```typescript
class HealthChecker {
  async checkHealth(): Promise<HealthStatus> {
    const checks = await Promise.allSettled([
      this.checkLibreOffice(),
      this.checkPandoc(),
      this.checkRedis(),
      this.checkDiskSpace(),
      this.checkMemory()
    ])
    
    const results = checks.map((check, index) => ({
      service: ['libreoffice', 'pandoc', 'redis', 'disk', 'memory'][index],
      status: check.status === 'fulfilled' ? 'healthy' : 'unhealthy',
      error: check.status === 'rejected' ? check.reason.message : null
    }))
    
    return {
      status: results.every(r => r.status === 'healthy') ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      services: results
    }
  }
  
  private async checkLibreOffice(): Promise<void> {
    await execAsync('libreoffice --version')
  }
  
  private async checkDiskSpace(): Promise<void> {
    const stats = await fs.statvfs('/tmp')
    const freeSpace = stats.bavail * stats.frsize
    const minRequired = 1024 * 1024 * 1024 // 1GB
    
    if (freeSpace < minRequired) {
      throw new Error(`Insufficient disk space: ${freeSpace} bytes available`)
    }
  }
}
```

---

## 🎯 API Endpoints

### REST API
```typescript
// Convert file
POST /api/convert
Content-Type: multipart/form-data
{
  file: <binary>,
  targetFormat: "docx" | "pdf" | "csv" | "xlsx" | "zip",
  options?: ConversionOptions
}

// Download converted file
GET /api/download/:id
Response: Binary file with appropriate headers

// Get conversion status (for async operations)
GET /api/status/:jobId
Response: { status, progress, downloadUrl?, error? }

// Health check
GET /health
Response: { status: "healthy" | "unhealthy", services: [...] }

// Metrics (Prometheus format)
GET /metrics
Response: Prometheus metrics
```

### MCP Integration
```typescript
// List available tools
mcp.listTools() -> [pdf-to-word, excel-to-csv, create-archive, ...]

// Execute conversion
mcp.callTool("pdf-to-word", { fileData: "base64...", options: {...} })
-> { downloadUrl, filename, size, expiresAt }
```

---

## ✅ Success Criteria

### Performance Targets
- **Conversion Time**: < 30 seconds for files under 50MB
- **Memory Usage**: < 2GB per container
- **Success Rate**: > 99% for supported formats
- **Uptime**: > 99.9%

### Scalability
- **Horizontal scaling**: Multiple container instances
- **Load balancing**: Round-robin or least-connections
- **Auto-scaling**: Based on CPU/memory usage
- **Rate limiting**: Per-user and global limits

### Security
- **File validation**: Magic byte verification
- **Size limits**: Configurable per user tier
- **Malware scanning**: Optional ClamAV integration
- **Sandboxing**: Isolated conversion processes

This specification provides a complete blueprint for a production-ready file conversion service with ephemeral storage, MCP compatibility, and enterprise-grade security and performance features.