# Filter Service Specification

## Overview

A self-contained microservice for applying filters and transformations to images, audio, and data with ephemeral storage, MCP compatibility, and real-time processing capabilities. Files are processed in-memory with immediate results and no persistent storage.

---

## 🎯 Service Scope

### Supported Filter Categories

#### Image Filters
- **Basic Adjustments**: Brightness, contrast, saturation, hue, gamma
- **Color Effects**: Grayscale, sepia, vintage, black & white, color tinting
- **Artistic Filters**: Oil painting, watercolor, sketch, cartoon, pop art
- **Enhancement**: Sharpen, blur, noise reduction, edge enhancement
- **Distortion**: Fisheye, barrel, perspective correction, rotation
- **Instagram-style**: Valencia, Nashville, X-Pro II, Amaro, Mayfair

#### Audio Filters
- **Equalization**: Bass boost, treble boost, vocal enhancement
- **Effects**: Reverb, echo, chorus, flanger, phaser
- **Cleanup**: Noise reduction, click removal, hum removal
- **Dynamics**: Compression, limiting, normalization
- **Spatial**: Stereo widening, mono conversion, 3D audio

#### Data Filters
- **Text Processing**: Case conversion, whitespace cleanup, encoding
- **JSON/XML**: Formatting, minification, validation, transformation
- **CSV Processing**: Column filtering, data cleaning, format conversion
- **Log Processing**: Parsing, filtering, anonymization

---

## 🏗️ Architecture

### Container Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                  Filter Service                              │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                 API Gateway                           │  │
│  │  • Rate limiting (Redis)                             │  │
│  │  • Filter validation                                 │  │
│  │  • Real-time processing                              │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Filter Processing Engine                 │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │  │
│  │  │   Image     │  │    Audio    │  │    Data     │  │  │
│  │  │  Processor  │  │  Processor  │  │  Processor  │  │  │
│  │  │             │  │             │  │             │  │  │
│  │  │ • Sharp     │  │ • Web Audio │  │ • JSON/XML  │  │  │
│  │  │ • Canvas    │  │ • SoX       │  │ • CSV       │  │  │
│  │  │ • OpenCV    │  │ • FFmpeg    │  │ • RegExp    │  │  │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Filter Library                           │  │
│  │  • Preset collections                                │  │
│  │  • Custom filter chains                              │  │
│  │  • Parameter validation                              │  │
│  │  • Performance optimization                          │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              In-Memory Processing                     │  │
│  │  • Stream processing                                 │  │
│  │  • Buffer management                                 │  │
│  │  • Immediate results                                 │  │
│  │  • No persistent storage                             │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                 MCP Interface                         │  │
│  │  • Real-time filter tools                            │  │
│  │  • Batch processing                                  │  │
│  │  • Filter presets                                    │  │
│  │  • Custom filter chains                              │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Technology Stack
- **Runtime**: Node.js 20+ with TypeScript
- **Framework**: Fastify (high performance)
- **Image Processing**:
  - Sharp (high-performance image processing)
  - Canvas API (2D graphics and effects)
  - OpenCV.js (computer vision filters)
- **Audio Processing**:
  - Web Audio API (real-time effects)
  - SoX (command-line audio processing)
  - FFmpeg (audio filters)
- **Data Processing**:
  - Native JavaScript (JSON/XML/CSV)
  - Regular expressions (text processing)
  - Stream processing (large files)

---

## 🔒 Rate Limiting & Security

### Rate Limits by User Tier
```typescript
interface FilterRateLimits {
  anonymous: {
    requests_per_minute: 30
    max_file_size_mb: 10
    concurrent_operations: 2
    allowed_filters: ['basic', 'grayscale', 'brightness', 'contrast']
    batch_size: 5
  }
  
  registered: {
    requests_per_minute: 100
    max_file_size_mb: 50
    concurrent_operations: 5
    allowed_filters: 'all'
    batch_size: 20
  }
  
  premium: {
    requests_per_minute: 500
    max_file_size_mb: 200
    concurrent_operations: 10
    allowed_filters: 'all'
    batch_size: 100
    custom_filters: true
    priority_processing: true
  }
}
```

### Filter Security Validation
```typescript
class FilterSecurityValidator {
  private allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  private allowedAudioTypes = ['audio/mpeg', 'audio/wav', 'audio/flac', 'audio/aac']
  
  async validateFilterRequest(request: FilterRequest): Promise<ValidationResult> {
    // Validate file type
    if (request.type === 'image' && !this.allowedImageTypes.includes(request.mimeType)) {
      throw new SecurityError(`Image type not supported: ${request.mimeType}`)
    }
    
    // Validate filter parameters
    this.validateFilterParameters(request.filters)
    
    // Check for resource-intensive operations
    this.validateResourceUsage(request)
    
    // Validate batch size
    if (request.batch && request.batch.length > this.maxBatchSize) {
      throw new SecurityError(`Batch size exceeds limit: ${request.batch.length}`)
    }
    
    return { valid: true }
  }
  
  private validateFilterParameters(filters: Filter[]): void {
    filters.forEach(filter => {
      // Validate parameter ranges
      if (filter.brightness && (filter.brightness < -100 || filter.brightness > 100)) {
        throw new SecurityError('Brightness value out of range (-100 to 100)')
      }
      
      if (filter.blur && (filter.blur < 0 || filter.blur > 50)) {
        throw new SecurityError('Blur value out of range (0 to 50)')
      }
      
      // Prevent malicious filter chains
      if (filters.length > 20) {
        throw new SecurityError('Too many filters in chain (max 20)')
      }
    })
  }
}
```

---

## 🎨 Filter Implementations

### Image Filter Engine
```typescript
class ImageFilterEngine {
  private sharp = require('sharp')
  
  async applyFilters(
    inputBuffer: Buffer,
    filters: ImageFilter[],
    options: ProcessingOptions = {}
  ): Promise<Buffer> {
    let pipeline = this.sharp(inputBuffer)
    
    // Apply filters in sequence
    for (const filter of filters) {
      pipeline = await this.applyImageFilter(pipeline, filter)
    }
    
    // Apply output options
    if (options.quality) {
      pipeline = pipeline.jpeg({ quality: options.quality })
    }
    
    if (options.format) {
      pipeline = this.setOutputFormat(pipeline, options.format)
    }
    
    return pipeline.toBuffer()
  }
  
  private async applyImageFilter(pipeline: Sharp, filter: ImageFilter): Promise<Sharp> {
    switch (filter.type) {
      case 'brightness':
        return pipeline.modulate({ brightness: 1 + (filter.value / 100) })
        
      case 'contrast':
        return pipeline.linear(1 + (filter.value / 100), 0)
        
      case 'saturation':
        return pipeline.modulate({ saturation: 1 + (filter.value / 100) })
        
      case 'hue':
        return pipeline.modulate({ hue: filter.value })
        
      case 'grayscale':
        return pipeline.grayscale()
        
      case 'sepia':
        return pipeline.recomb([
          [0.393, 0.769, 0.189],
          [0.349, 0.686, 0.168],
          [0.272, 0.534, 0.131]
        ])
        
      case 'blur':
        return pipeline.blur(filter.value || 1)
        
      case 'sharpen':
        return pipeline.sharpen(filter.value || 1)
        
      case 'vintage':
        return pipeline
          .modulate({ saturation: 0.8, brightness: 1.1 })
          .tint({ r: 255, g: 240, b: 200 })
          
      case 'edge_detection':
        return pipeline.convolve({
          width: 3,
          height: 3,
          kernel: [-1, -1, -1, -1, 8, -1, -1, -1, -1]
        })
        
      case 'emboss':
        return pipeline.convolve({
          width: 3,
          height: 3,
          kernel: [-2, -1, 0, -1, 1, 1, 0, 1, 2]
        })
        
      case 'oil_painting':
        return this.applyOilPaintingEffect(pipeline, filter.intensity || 5)
        
      case 'cartoon':
        return this.applyCartoonEffect(pipeline, filter.intensity || 7)
        
      default:
        console.warn(`Unknown filter type: ${filter.type}`)
        return pipeline
    }
  }
  
  private async applyOilPaintingEffect(pipeline: Sharp, intensity: number): Promise<Sharp> {
    // Simplified oil painting effect using blur and posterization
    return pipeline
      .blur(intensity / 2)
      .modulate({ saturation: 1.2 })
      .linear(1.1, -10) // Increase contrast slightly
  }
  
  private async applyCartoonEffect(pipeline: Sharp, intensity: number): Promise<Sharp> {
    // Cartoon effect using edge detection and color reduction
    return pipeline
      .blur(1)
      .modulate({ saturation: 1.3 })
      .linear(1.2, -15)
  }
  
  async applyInstagramFilter(
    inputBuffer: Buffer,
    filterName: string
  ): Promise<Buffer> {
    const presets = {
      valencia: [
        { type: 'brightness', value: 10 },
        { type: 'contrast', value: 15 },
        { type: 'saturation', value: 20 },
        { type: 'vintage', intensity: 0.3 }
      ],
      nashville: [
        { type: 'sepia' },
        { type: 'contrast', value: 25 },
        { type: 'brightness', value: 5 }
      ],
      xpro2: [
        { type: 'contrast', value: 30 },
        { type: 'saturation', value: -10 },
        { type: 'brightness', value: -5 }
      ]
    }
    
    const filters = presets[filterName]
    if (!filters) {
      throw new Error(`Unknown Instagram filter: ${filterName}`)
    }
    
    return this.applyFilters(inputBuffer, filters)
  }
}
```

### Audio Filter Engine
```typescript
class AudioFilterEngine {
  async applyAudioFilters(
    inputBuffer: Buffer,
    filters: AudioFilter[],
    options: AudioProcessingOptions = {}
  ): Promise<Buffer> {
    // For real-time processing, use Web Audio API approach
    if (this.isRealTimeProcessing(filters)) {
      return this.processWithWebAudio(inputBuffer, filters)
    }
    
    // For complex processing, use SoX
    return this.processWithSoX(inputBuffer, filters, options)
  }
  
  private async processWithWebAudio(
    inputBuffer: Buffer,
    filters: AudioFilter[]
  ): Promise<Buffer> {
    // Convert buffer to AudioBuffer for processing
    const audioContext = new (require('web-audio-api').AudioContext)()
    const audioBuffer = await this.bufferToAudioBuffer(inputBuffer, audioContext)
    
    let processedBuffer = audioBuffer
    
    for (const filter of filters) {
      processedBuffer = await this.applyWebAudioFilter(processedBuffer, filter, audioContext)
    }
    
    return this.audioBufferToBuffer(processedBuffer)
  }
  
  private async processWithSoX(
    inputBuffer: Buffer,
    filters: AudioFilter[],
    options: AudioProcessingOptions
  ): Promise<Buffer> {
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'audio-filter-'))
    const inputPath = path.join(tempDir, 'input.wav')
    const outputPath = path.join(tempDir, 'output.wav')
    
    try {
      await fs.writeFile(inputPath, inputBuffer)
      
      const command = ['sox', inputPath, outputPath]
      
      // Add filter effects
      filters.forEach(filter => {
        switch (filter.type) {
          case 'equalizer':
            if (filter.bands) {
              filter.bands.forEach(band => {
                command.push('equalizer', 
                            band.frequency.toString(),
                            band.width.toString(), 
                            band.gain.toString())
              })
            }
            break
            
          case 'reverb':
            command.push('reverb', 
                        (filter.reverberance || 50).toString(),
                        (filter.damping || 50).toString(),
                        (filter.roomScale || 100).toString())
            break
            
          case 'echo':
            command.push('echo', 
                        (filter.delay || 0.5).toString(),
                        (filter.decay || 0.6).toString())
            break
            
          case 'chorus':
            command.push('chorus', 
                        (filter.gainIn || 0.4).toString(),
                        (filter.gainOut || 0.9).toString(),
                        (filter.delay || 60).toString(),
                        (filter.decay || 0.4).toString(),
                        (filter.speed || 0.25).toString(),
                        (filter.depth || 2).toString())
            break
            
          case 'normalize':
            command.push('norm', (filter.level || -3).toString())
            break
            
          case 'compressor':
            command.push('compand', 
                        '0.3,1', 
                        '6:-70,-60,-20', 
                        '-5', 
                        '-90', 
                        '0.2')
            break
            
          case 'noise_reduction':
            command.push('noisered', filter.profile || 'noise.prof', '0.21')
            break
        }
      })
      
      await this.executeSoX(command)
      return await fs.readFile(outputPath)
      
    } finally {
      await fs.rm(tempDir, { recursive: true, force: true })
    }
  }
  
  async createAudioPreset(presetName: string, inputBuffer: Buffer): Promise<Buffer> {
    const presets = {
      'vocal_enhance': [
        { type: 'equalizer', bands: [
          { frequency: 2000, width: 1000, gain: 3 },
          { frequency: 4000, width: 2000, gain: 2 }
        ]},
        { type: 'compressor', ratio: 3, threshold: -20 }
      ],
      'bass_boost': [
        { type: 'equalizer', bands: [
          { frequency: 60, width: 100, gain: 6 },
          { type: 100, width: 200, gain: 4 }
        ]}
      ],
      'radio_voice': [
        { type: 'equalizer', bands: [
          { frequency: 300, width: 200, gain: -6 },
          { frequency: 3000, width: 2000, gain: 3 }
        ]},
        { type: 'compressor', ratio: 4, threshold: -15 }
      ]
    }
    
    const filters = presets[presetName]
    if (!filters) {
      throw new Error(`Unknown audio preset: ${presetName}`)
    }
    
    return this.applyAudioFilters(inputBuffer, filters)
  }
}
```

### Data Filter Engine
```typescript
class DataFilterEngine {
  async applyDataFilters(
    input: string | Buffer,
    filters: DataFilter[],
    inputType: 'json' | 'xml' | 'csv' | 'text'
  ): Promise<string> {
    let data = input.toString()
    
    for (const filter of filters) {
      data = await this.applyDataFilter(data, filter, inputType)
    }
    
    return data
  }
  
  private async applyDataFilter(
    data: string,
    filter: DataFilter,
    inputType: string
  ): Promise<string> {
    switch (filter.type) {
      case 'json_format':
        return this.formatJSON(data, filter.indent || 2)
        
      case 'json_minify':
        return JSON.stringify(JSON.parse(data))
        
      case 'xml_format':
        return this.formatXML(data, filter.indent || 2)
        
      case 'csv_clean':
        return this.cleanCSV(data, filter.options)
        
      case 'text_case':
        return this.convertCase(data, filter.caseType)
        
      case 'remove_whitespace':
        return data.replace(/\s+/g, ' ').trim()
        
      case 'remove_empty_lines':
        return data.replace(/^\s*[\r\n]/gm, '')
        
      case 'extract_emails':
        const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g
        return (data.match(emailRegex) || []).join('\n')
        
      case 'extract_urls':
        const urlRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g
        return (data.match(urlRegex) || []).join('\n')
        
      case 'anonymize_data':
        return this.anonymizeData(data, filter.fields)
        
      case 'validate_json':
        try {
          JSON.parse(data)
          return JSON.stringify({ valid: true, data })
        } catch (error) {
          return JSON.stringify({ valid: false, error: error.message })
        }
        
      default:
        return data
    }
  }
  
  private formatJSON(data: string, indent: number): string {
    try {
      const parsed = JSON.parse(data)
      return JSON.stringify(parsed, null, indent)
    } catch (error) {
      throw new Error(`Invalid JSON: ${error.message}`)
    }
  }
  
  private formatXML(data: string, indent: number): string {
    // Simple XML formatting (for production, use a proper XML library)
    const formatted = data
      .replace(/></g, '>\n<')
      .replace(/^\s*[\r\n]/gm, '')
    
    const lines = formatted.split('\n')
    let indentLevel = 0
    const indentStr = ' '.repeat(indent)
    
    return lines.map(line => {
      const trimmed = line.trim()
      if (trimmed.startsWith('</')) {
        indentLevel--
      }
      
      const result = indentStr.repeat(Math.max(0, indentLevel)) + trimmed
      
      if (trimmed.startsWith('<') && !trimmed.startsWith('</') && !trimmed.endsWith('/>')) {
        indentLevel++
      }
      
      return result
    }).join('\n')
  }
  
  private cleanCSV(data: string, options: CSVCleanOptions = {}): string {
    const lines = data.split('\n')
    
    return lines
      .filter(line => {
        // Remove empty lines if specified
        if (options.removeEmptyLines && !line.trim()) {
          return false
        }
        return true
      })
      .map(line => {
        // Clean each field
        const fields = line.split(',').map(field => {
          let cleaned = field.trim()
          
          // Remove quotes if specified
          if (options.removeQuotes) {
            cleaned = cleaned.replace(/^["']|["']$/g, '')
          }
          
          // Normalize whitespace
          if (options.normalizeWhitespace) {
            cleaned = cleaned.replace(/\s+/g, ' ')
          }
          
          return cleaned
        })
        
        return fields.join(',')
      })
      .join('\n')
  }
  
  private convertCase(data: string, caseType: string): string {
    switch (caseType) {
      case 'upper':
        return data.toUpperCase()
      case 'lower':
        return data.toLowerCase()
      case 'title':
        return data.replace(/\w\S*/g, (txt) => 
          txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase())
      case 'camel':
        return data.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => 
          index === 0 ? word.toLowerCase() : word.toUpperCase()).replace(/\s+/g, '')
      case 'snake':
        return data.toLowerCase().replace(/\s+/g, '_')
      case 'kebab':
        return data.toLowerCase().replace(/\s+/g, '-')
      default:
        return data
    }
  }
  
  private anonymizeData(data: string, fields: string[]): string {
    let anonymized = data
    
    // Anonymize email addresses
    if (fields.includes('email')) {
      anonymized = anonymized.replace(
        /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
        'user@example.com'
      )
    }
    
    // Anonymize phone numbers
    if (fields.includes('phone')) {
      anonymized = anonymized.replace(
        /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g,
        'XXX-XXX-XXXX'
      )
    }
    
    // Anonymize IP addresses
    if (fields.includes('ip')) {
      anonymized = anonymized.replace(
        /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g,
        'XXX.XXX.XXX.XXX'
      )
    }
    
    return anonymized
  }
}
```

---

## 🔌 MCP Tool Definitions

### Image Filter Tools
```typescript
const imageFilterTools: MCPTool[] = [
  {
    name: "apply-image-filter",
    description: "Apply filters and effects to images",
    inputSchema: {
      type: "object",
      properties: {
        imageData: {
          type: "string",
          description: "Base64 encoded image data"
        },
        filters: {
          type: "array",
          items: {
            type: "object",
            properties: {
              type: {
                type: "string",
                enum: [
                  "brightness", "contrast", "saturation", "hue",
                  "grayscale", "sepia", "vintage", "blur", "sharpen",
                  "edge_detection", "emboss", "oil_painting", "cartoon"
                ]
              },
              value: {
                type: "number",
                minimum: -100,
                maximum: 100,
                description: "Filter intensity (-100 to 100)"
              }
            },
            required: ["type"]
          }
        },
        outputFormat: {
          type: "string",
          enum: ["jpeg", "png", "webp"],
          default: "jpeg"
        },
        quality: {
          type: "number",
          minimum: 1,
          maximum: 100,
          default: 85
        }
      },
      required: ["imageData", "filters"]
    },
    execute: async (args) => {
      const imageBuffer = Buffer.from(args.imageData, 'base64')
      const filteredBuffer = await this.imageFilterEngine.applyFilters(
        imageBuffer,
        args.filters,
        { format: args.outputFormat, quality: args.quality }
      )
      
      return {
        success: true,
        imageData: filteredBuffer.toString('base64'),
        format: args.outputFormat,
        size: filteredBuffer.length,
        filtersApplied: args.filters.map(f => f.type)
      }
    }
  },
  
  {
    name: "instagram-filter",
    description: "Apply Instagram-style filters to images",
    inputSchema: {
      type: "object",
      properties: {
        imageData: { type: "string" },
        filterName: {
          type: "string",
          enum: ["valencia", "nashville", "xpro2", "amaro", "mayfair", "rise", "hudson"],
          description: "Instagram filter preset"
        },
        intensity: {
          type: "number",
          minimum: 0,
          maximum: 100,
          default: 100,
          description: "Filter intensity (0-100%)"
        }
      },
      required: ["imageData", "filterName"]
    },
    execute: async (args) => {
      const imageBuffer = Buffer.from(args.imageData, 'base64')
      const filteredBuffer = await this.imageFilterEngine.applyInstagramFilter(
        imageBuffer,
        args.filterName
      )
      
      return {
        success: true,
        imageData: filteredBuffer.toString('base64'),
        filterApplied: args.filterName,
        intensity: args.intensity,
        size: filteredBuffer.length
      }
    }
  },
  
  {
    name: "batch-image-filter",
    description: "Apply the same filter to multiple images",
    inputSchema: {
      type: "object",
      properties: {
        images: {
          type: "array",
          items: {
            type: "object",
            properties: {
              data: { type: "string", description: "Base64 image data" },
              filename: { type: "string" }
            },
            required: ["data"]
          },
          maxItems: 50
        },
        filters: {
          type: "array",
          items: {
            type: "object",
            properties: {
              type: { type: "string" },
              value: { type: "number" }
            }
          }
        }
      },
      required: ["images", "filters"]
    },
    execute: async (args) => {
      const results = await Promise.all(
        args.images.map(async (image, index) => {
          try {
            const imageBuffer = Buffer.from(image.data, 'base64')
            const filteredBuffer = await this.imageFilterEngine.applyFilters(
              imageBuffer,
              args.filters
            )
            
            return {
              success: true,
              filename: image.filename || `image_${index + 1}.jpg`,
              data: filteredBuffer.toString('base64'),
              size: filteredBuffer.length
            }
          } catch (error) {
            return {
              success: false,
              filename: image.filename || `image_${index + 1}.jpg`,
              error: error.message
            }
          }
        })
      )
      
      const successful = results.filter(r => r.success)
      const failed = results.filter(r => !r.success)
      
      return {
        totalProcessed: args.images.length,
        successful: successful.length,
        failed: failed.length,
        results: results,
        filtersApplied: args.filters.map(f => f.type)
      }
    }
  }
]
```

### Audio Filter Tools
```typescript
const audioFilterTools: MCPTool[] = [
  {
    name: "apply-audio-filter",
    description: "Apply audio effects and filters",
    inputSchema: {
      type: "object",
      properties: {
        audioData: { type: "string", description: "Base64 encoded audio data" },
        filters: {
          type: "array",
          items: {
            type: "object",
            properties: {
              type: {
                type: "string",
                enum: ["equalizer", "reverb", "echo", "chorus", "normalize", "compressor", "noise_reduction"]
              },
              parameters: {
                type: "object",
                description: "Filter-specific parameters"
              }
            },
            required: ["type"]
          }
        },
        outputFormat: {
          type: "string",
          enum: ["mp3", "wav", "flac"],
          default: "mp3"
        }
      },
      required: ["audioData", "filters"]
    },
    execute: async (args) => {
      const audioBuffer = Buffer.from(args.audioData, 'base64')
      const filteredBuffer = await this.audioFilterEngine.applyAudioFilters(
        audioBuffer,
        args.filters,
        { outputFormat: args.outputFormat }
      )
      
      return {
        success: true,
        audioData: filteredBuffer.toString('base64'),
        format: args.outputFormat,
        size: filteredBuffer.length,
        filtersApplied: args.filters.map(f => f.type)
      }
    }
  },
  
  {
    name: "audio-preset",
    description: "Apply predefined audio enhancement presets",
    inputSchema: {
      type: "object",
      properties: {
        audioData: { type: "string" },
        preset: {
          type: "string",
          enum: ["vocal_enhance", "bass_boost", "treble_boost", "radio_voice", "podcast", "music_master"],
          description: "Audio enhancement preset"
        },
        intensity: {
          type: "number",
          minimum: 0,
          maximum: 100,
          default: 100
        }
      },
      required: ["audioData", "preset"]
    },
    execute: async (args) => {
      const audioBuffer = Buffer.from(args.audioData, 'base64')
      const enhancedBuffer = await this.audioFilterEngine.createAudioPreset(
        args.preset,
        audioBuffer
      )
      
      return {
        success: true,
        audioData: enhancedBuffer.toString('base64'),
        presetApplied: args.preset,
        intensity: args.intensity,
        size: enhancedBuffer.length
      }
    }
  }
]
```

### Data Filter Tools
```typescript
const dataFilterTools: MCPTool[] = [
  {
    name: "format-json",
    description: "Format, validate, and process JSON data",
    inputSchema: {
      type: "object",
      properties: {
        jsonData: { type: "string", description: "JSON string to process" },
        operation: {
          type: "string",
          enum: ["format", "minify", "validate", "extract_keys", "extract_values"],
          default: "format"
        },
        indent: {
          type: "number",
          minimum: 0,
          maximum: 8,
          default: 2
        }
      },
      required: ["jsonData"]
    },
    execute: async (args) => {
      try {
        const result = await this.dataFilterEngine.applyDataFilters(
          args.jsonData,
          [{ type: `json_${args.operation}`, indent: args.indent }],
          'json'
        )
        
        return {
          success: true,
          result: result,
          operation: args.operation,
          valid: true
        }
      } catch (error) {
        return {
          success: false,
          error: error.message,
          valid: false
        }
      }
    }
  },
  
  {
    name: "clean-csv",
    description: "Clean and process CSV data",
    inputSchema: {
      type: "object",
      properties: {
        csvData: { type: "string" },
        operations: {
          type: "array",
          items: {
            type: "string",
            enum: ["remove_empty_lines", "remove_quotes", "normalize_whitespace", "remove_duplicates"]
          }
        },
        delimiter: {
          type: "string",
          default: ",",
          description: "CSV delimiter"
        }
      },
      required: ["csvData"]
    },
    execute: async (args) => {
      const filters = args.operations.map(op => ({ type: op }))
      const result = await this.dataFilterEngine.applyDataFilters(
        args.csvData,
        filters,
        'csv'
      )
      
      const inputLines = args.csvData.split('\n').length
      const outputLines = result.split('\n').length
      
      return {
        success: true,
        result: result,
        operationsApplied: args.operations,
        statistics: {
          inputLines,
          outputLines,
          linesRemoved: inputLines - outputLines
        }
      }
    }
  },
  
  {
    name: "extract-data",
    description: "Extract specific data patterns from text",
    inputSchema: {
      type: "object",
      properties: {
        textData: { type: "string" },
        extractType: {
          type: "string",
          enum: ["emails", "urls", "phone_numbers", "ip_addresses", "dates"],
          description: "Type of data to extract"
        },
        format: {
          type: "string",
          enum: ["list", "json", "csv"],
          default: "list"
        }
      },
      required: ["textData", "extractType"]
    },
    execute: async (args) => {
      const result = await this.dataFilterEngine.applyDataFilters(
        args.textData,
        [{ type: `extract_${args.extractType}` }],
        'text'
      )
      
      const extracted = result.split('\n').filter(line => line.trim())
      
      let formattedResult = result
      if (args.format === 'json') {
        formattedResult = JSON.stringify(extracted, null, 2)
      } else if (args.format === 'csv') {
        formattedResult = extracted.join(',')
      }
      
      return {
        success: true,
        result: formattedResult,
        extractType: args.extractType,
        count: extracted.length,
        format: args.format
      }
    }
  }
]
```

---

## 💾 In-Memory Processing

### Stream Processing Manager
```typescript
class StreamProcessingManager {
  private maxMemoryUsage = 512 * 1024 * 1024 // 512MB
  
  async processStream<T>(
    input: Buffer | string,
    processor: (chunk: T) => Promise<T>,
    options: StreamOptions = {}
  ): Promise<Buffer | string> {
    const inputSize = Buffer.isBuffer(input) ? input.length : Buffer.byteLength(input)
    
    // For small inputs, process entirely in memory
    if (inputSize < this.maxMemoryUsage) {
      return this.processInMemory(input, processor)
    }
    
    // For large inputs, use streaming
    return this.processWithStreaming(input, processor, options)
  }
  
  private async processInMemory<T>(
    input: Buffer | string,
    processor: (chunk: T) => Promise<T>
  ): Promise<Buffer | string> {
    // Direct processing for small files
    return processor(input as T)
  }
  
  private async processWithStreaming<T>(
    input: Buffer | string,
    processor: (chunk: T) => Promise<T>,
    options: StreamOptions
  ): Promise<Buffer | string> {
    const chunkSize = options.chunkSize || 64 * 1024 // 64KB chunks
    const results: (Buffer | string)[] = []
    
    if (Buffer.isBuffer(input)) {
      // Process buffer in chunks
      for (let i = 0; i < input.length; i += chunkSize) {
        const chunk = input.slice(i, i + chunkSize)
        const processed = await processor(chunk as T)
        results.push(processed as Buffer | string)
      }
      
      return Buffer.concat(results as Buffer[])
    } else {
      // Process string in chunks
      for (let i = 0; i < input.length; i += chunkSize) {
        const chunk = input.slice(i, i + chunkSize)
        const processed = await processor(chunk as T)
        results.push(processed as string)
      }
      
      return results.join('')
    }
  }
}
```

### Memory Management
```typescript
class MemoryManager {
  private memoryUsage = new Map<string, number>()
  private maxTotalMemory = 2 * 1024 * 1024 * 1024 // 2GB
  
  async allocateMemory(operationId: string, size: number): Promise<boolean> {
    const currentUsage = this.getTotalMemoryUsage()
    
    if (currentUsage + size > this.maxTotalMemory) {
      // Try to free some memory
      await this.freeOldOperations()
      
      const newUsage = this.getTotalMemoryUsage()
      if (newUsage + size > this.maxTotalMemory) {
        return false // Cannot allocate
      }
    }
    
    this.memoryUsage.set(operationId, size)
    return true
  }
  
  releaseMemory(operationId: string): void {
    this.memoryUsage.delete(operationId)
    
    // Force garbage collection if available
    if (global.gc) {
      global.gc()
    }
  }
  
  private getTotalMemoryUsage(): number {
    return Array.from(this.memoryUsage.values()).reduce((sum, size) => sum + size, 0)
  }
  
  private async freeOldOperations(): Promise<void> {
    // Implementation would track operation timestamps and free oldest operations
    // This is a simplified version
    const operations = Array.from(this.memoryUsage.keys())
    const oldOperations = operations.slice(0, Math.floor(operations.length / 2))
    
    oldOperations.forEach(op => this.releaseMemory(op))
  }
  
  getMemoryStats(): MemoryStats {
    const process = require('process')
    const usage = process.memoryUsage()
    
    return {
      heapUsed: usage.heapUsed,
      heapTotal: usage.heapTotal,
      external: usage.external,
      allocated: this.getTotalMemoryUsage(),
      available: this.maxTotalMemory - this.getTotalMemoryUsage(),
      activeOperations: this.memoryUsage.size
    }
  }
}
```

---

## 🚀 Deployment Configuration

### Dockerfile
```dockerfile
FROM node:20-alpine

# Install image processing dependencies
RUN apk add --no-cache \
    vips-dev \
    sox \
    ffmpeg \
    python3 \
    make \
    g++

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .
RUN npm run build

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3002/health || exit 1

EXPOSE 3002

USER node

CMD ["node", "dist/index.js"]
```

### Docker Compose
```yaml
version: '3.8'

services:
  filter-service:
    build: .
    ports:
      - "3002:3002"
    environment:
      - NODE_ENV=production
      - REDIS_URL=redis://redis:6379
      - MAX_MEMORY_MB=2048
      - MAX_FILE_SIZE_MB=200
    depends_on:
      - redis
    restart: unless-stopped
    deploy:
      resources:
        limits:
          memory: 3G
          cpus: '2.0'
        reservations:
          memory: 1G
          cpus: '0.5'

  redis:
    image: redis:7-alpine
    ports:
      - "6381:6379"
    volumes:
      - redis_data:/data
    command: redis-server --maxmemory 256mb --maxmemory-policy allkeys-lru

volumes:
  redis_data:
```

---

## 📊 Performance Monitoring

### Filter-Specific Metrics
```typescript
class FilterMetrics {
  private metrics = {
    filtersApplied: new Counter({
      name: 'filters_applied_total',
      help: 'Total filters applied',
      labelNames: ['type', 'category', 'status']
    }),
    
    processingTime: new Histogram({
      name: 'filter_processing_duration_seconds',
      help: 'Filter processing duration',
      labelNames: ['type', 'category'],
      buckets: [0.01, 0.05, 0.1, 0.5, 1, 2, 5, 10]
    }),
    
    memoryUsage: new Gauge({
      name: 'filter_memory_usage_bytes',
      help: 'Current memory usage for filtering'
    }),
    
    batchSize: new Histogram({
      name: 'filter_batch_size',
      help: 'Number of items in batch operations',
      buckets: [1, 5, 10, 20, 50, 100]
    })
  }
  
  recordFilter(
    type: string,
    category: 'image' | 'audio' | 'data',
    duration: number,
    success: boolean,
    batchSize = 1
  ) {
    this.metrics.filtersApplied.inc({
      type,
      category,
      status: success ? 'success' : 'error'
    })
    
    if (success) {
      this.metrics.processingTime.observe({ type, category }, duration)
      this.metrics.batchSize.observe(batchSize)
    }
  }
  
  updateMemoryUsage(bytes: number) {
    this.metrics.memoryUsage.set(bytes)
  }
}
```

---

## 🎯 API Endpoints

### REST API
```typescript
// Apply filters
POST /api/filter
Content-Type: application/json
{
  type: "image" | "audio" | "data",
  data: "base64...",
  filters: [...],
  options?: {...}
}

// Batch filter processing
POST /api/filter/batch
Content-Type: application/json
{
  type: "image",
  items: [{ data: "base64...", filename?: "..." }],
  filters: [...]
}

// Get available filters
GET /api/filters/:type
Response: { filters: [...], presets: [...] }

// Health check
GET /health
Response: { status, memory: {...}, services: [...] }
```

---

## ✅ Success Criteria

### Performance Targets
- **Image Processing**: < 2 seconds for 10MP images
- **Audio Processing**: < 1 second for 1-minute audio
- **Data Processing**: < 500ms for 1MB text files
- **Memory Usage**: < 3GB per container
- **Success Rate**: > 99.5% for supported operations

### Quality Metrics
- **Image Quality**: Maintain visual fidelity
- **Audio Quality**: No artifacts or distortion
- **Data Integrity**: 100% accuracy for data transformations
- **Real-time Processing**: < 100ms for simple filters

This specification provides a complete blueprint for a production-ready filter service with real-time processing, comprehensive filter libraries, and enterprise-grade performance monitoring.