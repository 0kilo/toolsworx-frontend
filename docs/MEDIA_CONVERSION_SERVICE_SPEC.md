# Media Conversion Service Specification

## Overview

A self-contained microservice for audio and video format conversions with ephemeral storage, MCP compatibility, and GPU acceleration support. Media files are processed in temporary storage and immediately available for download without persistent storage.

---

## 🎯 Service Scope

### Supported Conversions

#### Video Formats
- **Container Formats**: MP4 ↔ AVI ↔ MOV ↔ WebM ↔ MKV ↔ FLV
- **Codec Conversions**: H.264 ↔ H.265 (HEVC) ↔ VP9 ↔ AV1
- **Quality Adjustments**: 4K → 1080p → 720p → 480p
- **Frame Rate**: 60fps → 30fps → 24fps
- **Compression**: Bitrate optimization, CRF settings

#### Audio Formats
- **Lossless**: FLAC ↔ WAV ↔ ALAC
- **Lossy**: MP3 ↔ AAC ↔ OGG ↔ WMA
- **Bitrate Conversion**: 320kbps → 192kbps → 128kbps → 64kbps
- **Sample Rate**: 48kHz → 44.1kHz → 22kHz
- **Channel Conversion**: Stereo ↔ Mono ↔ 5.1 Surround

#### Media Operations
- **Extract Audio**: From video files
- **Add Audio**: To video files
- **Trim/Cut**: Specific time ranges
- **Merge**: Multiple files
- **Subtitle Integration**: SRT, VTT, ASS

---

## 🏗️ Architecture

### Container Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                Media Conversion Service                      │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                 API Gateway                           │  │
│  │  • Rate limiting (Redis)                             │  │
│  │  • File validation                                   │  │
│  │  • Progress tracking                                 │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Media Processing Engine                  │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │  │
│  │  │   FFmpeg    │  │  HandBrake  │  │    SoX      │  │  │
│  │  │ Processor   │  │ Processor   │  │ Processor   │  │  │
│  │  │ (GPU/CPU)   │  │   (CPU)     │  │  (Audio)    │  │  │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Job Queue System                         │  │
│  │  • Redis-based queue                                 │  │
│  │  • Progress tracking                                 │  │
│  │  • Priority processing                               │  │
│  │  • Retry logic                                       │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Ephemeral Storage                        │  │
│  │  • Streaming processing                              │  │
│  │  • Temp disk storage                                 │  │
│  │  • Auto-cleanup (10 min TTL)                         │  │
│  │  • Download URLs (2 hour TTL)                        │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                 MCP Interface                         │  │
│  │  • Async job management                              │  │
│  │  • Progress callbacks                                │  │
│  │  • Batch operations                                  │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Technology Stack
- **Runtime**: Node.js 20+ with TypeScript
- **Framework**: Fastify (high performance)
- **Media Libraries**:
  - FFmpeg (primary video/audio processing)
  - HandBrake (video compression optimization)
  - SoX (audio processing and effects)
  - MediaInfo (file analysis)
- **Queue**: Redis with BullMQ
- **Storage**: Streaming + temp filesystem
- **GPU**: NVIDIA NVENC/NVDEC support

---

## 🔒 Rate Limiting & Security

### Rate Limits by User Tier
```typescript
interface MediaRateLimits {
  anonymous: {
    requests_per_hour: 5
    max_file_size_mb: 100
    max_duration_minutes: 5
    concurrent_jobs: 1
    allowed_formats: ['mp4', 'mp3', 'wav']
    gpu_access: false
  }
  
  registered: {
    requests_per_hour: 25
    max_file_size_mb: 500
    max_duration_minutes: 30
    concurrent_jobs: 2
    allowed_formats: 'all'
    gpu_access: false
  }
  
  premium: {
    requests_per_hour: 100
    max_file_size_mb: 2000
    max_duration_minutes: 120
    concurrent_jobs: 5
    allowed_formats: 'all'
    gpu_access: true
    priority_processing: true
  }
}
```

### Media File Security
```typescript
class MediaSecurityValidator {
  private allowedVideoCodecs = ['h264', 'h265', 'vp9', 'av1', 'mpeg4']
  private allowedAudioCodecs = ['aac', 'mp3', 'flac', 'vorbis', 'opus']
  
  async validateMediaFile(filePath: string): Promise<MediaValidationResult> {
    // Get media information
    const mediaInfo = await this.getMediaInfo(filePath)
    
    // Validate duration
    if (mediaInfo.duration > this.maxDuration) {
      throw new SecurityError(`Media duration exceeds limit: ${mediaInfo.duration}s`)
    }
    
    // Validate codecs
    if (mediaInfo.videoCodec && !this.allowedVideoCodecs.includes(mediaInfo.videoCodec)) {
      throw new SecurityError(`Video codec not allowed: ${mediaInfo.videoCodec}`)
    }
    
    if (mediaInfo.audioCodec && !this.allowedAudioCodecs.includes(mediaInfo.audioCodec)) {
      throw new SecurityError(`Audio codec not allowed: ${mediaInfo.audioCodec}`)
    }
    
    // Check for suspicious metadata
    await this.scanMetadata(mediaInfo.metadata)
    
    return {
      valid: true,
      info: mediaInfo,
      estimatedProcessingTime: this.estimateProcessingTime(mediaInfo)
    }
  }
  
  private async getMediaInfo(filePath: string): Promise<MediaInfo> {
    const result = await execAsync(`ffprobe -v quiet -print_format json -show_format -show_streams "${filePath}"`)
    return JSON.parse(result.stdout)
  }
}
```

---

## 🎬 Media Processing Implementations

### Video Conversion Engine
```typescript
class VideoConverter {
  private ffmpegPath = '/usr/bin/ffmpeg'
  private gpuEnabled = process.env.GPU_ENABLED === 'true'
  
  async convertVideo(
    inputPath: string,
    outputPath: string,
    options: VideoConversionOptions,
    onProgress?: (progress: number) => void
  ): Promise<ConversionResult> {
    const command = this.buildFFmpegCommand(inputPath, outputPath, options)
    
    return new Promise((resolve, reject) => {
      const process = spawn(this.ffmpegPath, command, {
        stdio: ['pipe', 'pipe', 'pipe']
      })
      
      let duration = 0
      let currentTime = 0
      
      process.stderr.on('data', (data) => {
        const output = data.toString()
        
        // Parse duration
        const durationMatch = output.match(/Duration: (\d{2}):(\d{2}):(\d{2})\.(\d{2})/)
        if (durationMatch) {
          duration = this.parseTime(durationMatch.slice(1))
        }
        
        // Parse progress
        const timeMatch = output.match(/time=(\d{2}):(\d{2}):(\d{2})\.(\d{2})/)
        if (timeMatch && duration > 0) {
          currentTime = this.parseTime(timeMatch.slice(1))
          const progress = Math.min((currentTime / duration) * 100, 100)
          onProgress?.(progress)
        }
      })
      
      process.on('close', (code) => {
        if (code === 0) {
          resolve({ success: true, outputPath })
        } else {
          reject(new Error(`FFmpeg exited with code ${code}`))
        }
      })
      
      process.on('error', reject)
      
      // Set timeout based on file size and complexity
      setTimeout(() => {
        process.kill('SIGKILL')
        reject(new Error('Conversion timeout'))
      }, this.getTimeoutForOptions(options))
    })
  }
  
  private buildFFmpegCommand(
    inputPath: string,
    outputPath: string,
    options: VideoConversionOptions
  ): string[] {
    const command = ['-i', inputPath]
    
    // Video codec
    if (options.videoCodec) {
      if (this.gpuEnabled && options.useGPU) {
        command.push('-c:v', this.getGPUCodec(options.videoCodec))
      } else {
        command.push('-c:v', options.videoCodec)
      }
    }
    
    // Audio codec
    if (options.audioCodec) {
      command.push('-c:a', options.audioCodec)
    }
    
    // Quality settings
    if (options.crf !== undefined) {
      command.push('-crf', options.crf.toString())
    }
    
    if (options.bitrate) {
      command.push('-b:v', options.bitrate)
    }
    
    // Resolution
    if (options.resolution) {
      command.push('-vf', `scale=${options.resolution}`)
    }
    
    // Frame rate
    if (options.framerate) {
      command.push('-r', options.framerate.toString())
    }
    
    // Optimization flags
    command.push('-movflags', '+faststart') // Web optimization
    command.push('-preset', options.preset || 'medium')
    
    command.push(outputPath)
    return command
  }
  
  private getGPUCodec(codec: string): string {
    const gpuCodecs = {
      'h264': 'h264_nvenc',
      'h265': 'hevc_nvenc',
      'hevc': 'hevc_nvenc'
    }
    return gpuCodecs[codec] || codec
  }
}
```

### Audio Processing Engine
```typescript
class AudioProcessor {
  private soxPath = '/usr/bin/sox'
  
  async convertAudio(
    inputPath: string,
    outputPath: string,
    options: AudioConversionOptions,
    onProgress?: (progress: number) => void
  ): Promise<ConversionResult> {
    // For simple format conversion, use FFmpeg
    if (this.isSimpleConversion(options)) {
      return this.convertWithFFmpeg(inputPath, outputPath, options, onProgress)
    }
    
    // For complex audio processing, use SoX
    return this.processWithSoX(inputPath, outputPath, options, onProgress)
  }
  
  private async convertWithFFmpeg(
    inputPath: string,
    outputPath: string,
    options: AudioConversionOptions,
    onProgress?: (progress: number) => void
  ): Promise<ConversionResult> {
    const command = [
      '-i', inputPath,
      '-acodec', this.getAudioCodec(options.format),
      '-ab', `${options.bitrate || 128}k`,
      '-ar', (options.sampleRate || 44100).toString()
    ]
    
    if (options.channels) {
      command.push('-ac', options.channels.toString())
    }
    
    command.push(outputPath)
    
    return this.executeFFmpeg(command, onProgress)
  }
  
  private async processWithSoX(
    inputPath: string,
    outputPath: string,
    options: AudioConversionOptions,
    onProgress?: (progress: number) => void
  ): Promise<ConversionResult> {
    const command = [inputPath, outputPath]
    
    // Apply audio effects
    if (options.effects) {
      options.effects.forEach(effect => {
        switch (effect.type) {
          case 'normalize':
            command.push('norm', (effect.level || -3).toString())
            break
            
          case 'noise_reduction':
            command.push('noisered', effect.profile || 'noise.prof', '0.21')
            break
            
          case 'equalizer':
            if (effect.bands) {
              effect.bands.forEach(band => {
                command.push('equalizer', 
                            band.frequency.toString(),
                            band.width.toString(), 
                            band.gain.toString())
              })
            }
            break
            
          case 'reverb':
            command.push('reverb', 
                        (effect.reverberance || 50).toString(),
                        (effect.damping || 50).toString(),
                        (effect.roomScale || 100).toString())
            break
        }
      })
    }
    
    return this.executeSoX(command, onProgress)
  }
  
  async extractAudioFromVideo(
    videoPath: string,
    audioPath: string,
    options: AudioExtractionOptions = {}
  ): Promise<ConversionResult> {
    const command = [
      '-i', videoPath,
      '-vn', // No video
      '-acodec', options.codec || 'mp3',
      '-ab', `${options.bitrate || 128}k`
    ]
    
    if (options.startTime) {
      command.splice(1, 0, '-ss', options.startTime)
    }
    
    if (options.duration) {
      command.push('-t', options.duration)
    }
    
    command.push(audioPath)
    
    return this.executeFFmpeg(command)
  }
}
```

### Media Analysis & Optimization
```typescript
class MediaAnalyzer {
  async analyzeMedia(filePath: string): Promise<MediaAnalysis> {
    const mediaInfo = await this.getDetailedMediaInfo(filePath)
    
    return {
      format: mediaInfo.format,
      duration: mediaInfo.duration,
      fileSize: mediaInfo.size,
      video: mediaInfo.streams.find(s => s.codec_type === 'video'),
      audio: mediaInfo.streams.find(s => s.codec_type === 'audio'),
      bitrate: mediaInfo.bit_rate,
      recommendations: this.generateOptimizationRecommendations(mediaInfo)
    }
  }
  
  private generateOptimizationRecommendations(mediaInfo: any): OptimizationRecommendation[] {
    const recommendations: OptimizationRecommendation[] = []
    
    const video = mediaInfo.streams.find(s => s.codec_type === 'video')
    const audio = mediaInfo.streams.find(s => s.codec_type === 'audio')
    
    // Video optimization recommendations
    if (video) {
      if (video.bit_rate > 10000000) { // > 10 Mbps
        recommendations.push({
          type: 'video_bitrate',
          current: video.bit_rate,
          recommended: 5000000,
          reason: 'High bitrate detected, can reduce file size significantly',
          savings: '~50% file size reduction'
        })
      }
      
      if (video.width > 1920) { // > 1080p
        recommendations.push({
          type: 'video_resolution',
          current: `${video.width}x${video.height}`,
          recommended: '1920x1080',
          reason: 'Most devices don\'t benefit from >1080p resolution',
          savings: '~60% file size reduction'
        })
      }
      
      if (video.codec_name === 'h264' && video.profile !== 'High') {
        recommendations.push({
          type: 'video_codec',
          current: `${video.codec_name} (${video.profile})`,
          recommended: 'h265 (HEVC)',
          reason: 'H.265 provides better compression than H.264',
          savings: '~30% file size reduction'
        })
      }
    }
    
    // Audio optimization recommendations
    if (audio) {
      if (audio.bit_rate > 320000) { // > 320 kbps
        recommendations.push({
          type: 'audio_bitrate',
          current: audio.bit_rate,
          recommended: 192000,
          reason: 'Audio quality above 192kbps rarely noticeable',
          savings: '~40% audio size reduction'
        })
      }
    }
    
    return recommendations
  }
}
```

---

## 🔌 MCP Tool Definitions

### Video Conversion Tools
```typescript
const videoTools: MCPTool[] = [
  {
    name: "video-convert",
    description: "Convert video between formats with quality options",
    inputSchema: {
      type: "object",
      properties: {
        videoData: {
          type: "string",
          description: "Base64 encoded video file or file URL"
        },
        outputFormat: {
          type: "string",
          enum: ["mp4", "avi", "mov", "webm", "mkv"],
          description: "Target video format"
        },
        quality: {
          type: "string",
          enum: ["ultra", "high", "medium", "low"],
          default: "medium",
          description: "Output quality preset"
        },
        resolution: {
          type: "string",
          enum: ["4k", "1440p", "1080p", "720p", "480p"],
          description: "Target resolution"
        },
        useGPU: {
          type: "boolean",
          default: false,
          description: "Use GPU acceleration (premium only)"
        }
      },
      required: ["videoData", "outputFormat"]
    },
    execute: async (args) => {
      const jobId = await this.queueVideoConversion({
        input: args.videoData,
        outputFormat: args.outputFormat,
        quality: args.quality,
        resolution: args.resolution,
        useGPU: args.useGPU
      })
      
      return {
        jobId,
        status: 'queued',
        estimatedTime: this.estimateVideoProcessingTime(args),
        statusUrl: `/api/jobs/${jobId}/status`,
        progressUrl: `/api/jobs/${jobId}/progress`
      }
    }
  },
  
  {
    name: "video-compress",
    description: "Compress video to reduce file size",
    inputSchema: {
      type: "object",
      properties: {
        videoData: { type: "string" },
        compressionLevel: {
          type: "string",
          enum: ["light", "medium", "aggressive"],
          default: "medium"
        },
        targetSizeMB: {
          type: "number",
          minimum: 1,
          description: "Target file size in MB"
        },
        maintainQuality: {
          type: "boolean",
          default: true,
          description: "Prioritize quality over file size"
        }
      },
      required: ["videoData"]
    },
    execute: async (args) => {
      const jobId = await this.queueVideoCompression(args)
      
      return {
        jobId,
        status: 'queued',
        estimatedTime: '5-20 minutes',
        note: 'Compression time varies based on source video complexity'
      }
    }
  },
  
  {
    name: "extract-audio",
    description: "Extract audio track from video file",
    inputSchema: {
      type: "object",
      properties: {
        videoData: { type: "string" },
        audioFormat: {
          type: "string",
          enum: ["mp3", "wav", "flac", "aac"],
          default: "mp3"
        },
        bitrate: {
          type: "number",
          enum: [64, 128, 192, 256, 320],
          default: 128
        },
        startTime: {
          type: "string",
          pattern: "^\\d{2}:\\d{2}:\\d{2}$",
          description: "Start time (HH:MM:SS)"
        },
        duration: {
          type: "string",
          pattern: "^\\d{2}:\\d{2}:\\d{2}$",
          description: "Duration (HH:MM:SS)"
        }
      },
      required: ["videoData"]
    },
    execute: async (args) => {
      const jobId = await this.queueAudioExtraction(args)
      
      return {
        jobId,
        status: 'queued',
        estimatedTime: '1-5 minutes',
        outputFormat: args.audioFormat
      }
    }
  }
]
```

### Audio Processing Tools
```typescript
const audioTools: MCPTool[] = [
  {
    name: "audio-convert",
    description: "Convert audio between formats",
    inputSchema: {
      type: "object",
      properties: {
        audioData: { type: "string" },
        outputFormat: {
          type: "string",
          enum: ["mp3", "wav", "flac", "aac", "ogg"]
        },
        bitrate: {
          type: "number",
          enum: [64, 128, 192, 256, 320],
          default: 128
        },
        sampleRate: {
          type: "number",
          enum: [22050, 44100, 48000, 96000],
          default: 44100
        },
        channels: {
          type: "number",
          enum: [1, 2],
          description: "1 for mono, 2 for stereo"
        }
      },
      required: ["audioData", "outputFormat"]
    },
    execute: async (args) => {
      // For simple conversions, process immediately if small file
      if (await this.isSmallAudioFile(args.audioData)) {
        const result = await this.processAudioSync(args)
        return {
          success: true,
          downloadUrl: result.url,
          filename: `converted.${args.outputFormat}`,
          size: result.size
        }
      }
      
      // Queue for larger files
      const jobId = await this.queueAudioConversion(args)
      return {
        jobId,
        status: 'queued',
        estimatedTime: '30 seconds - 3 minutes'
      }
    }
  },
  
  {
    name: "audio-enhance",
    description: "Apply audio enhancement effects",
    inputSchema: {
      type: "object",
      properties: {
        audioData: { type: "string" },
        effects: {
          type: "array",
          items: {
            type: "object",
            properties: {
              type: {
                type: "string",
                enum: ["normalize", "noise_reduction", "equalizer", "reverb", "compressor"]
              },
              intensity: {
                type: "number",
                minimum: 0,
                maximum: 100,
                default: 50
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
      required: ["audioData", "effects"]
    },
    execute: async (args) => {
      const jobId = await this.queueAudioEnhancement(args)
      
      return {
        jobId,
        status: 'queued',
        estimatedTime: '1-5 minutes',
        effects: args.effects.map(e => e.type)
      }
    }
  }
]
```

---

## 💾 Job Queue & Progress Tracking

### Async Job Management
```typescript
class MediaJobQueue {
  private videoQueue: Queue
  private audioQueue: Queue
  private progressTracker: Map<string, JobProgress> = new Map()
  
  constructor(redis: Redis) {
    this.videoQueue = new Queue('video-processing', {
      connection: redis,
      defaultJobOptions: {
        removeOnComplete: 50,
        removeOnFail: 25,
        attempts: 2,
        backoff: {
          type: 'exponential',
          delay: 5000
        }
      }
    })
    
    this.audioQueue = new Queue('audio-processing', {
      connection: redis,
      defaultJobOptions: {
        removeOnComplete: 100,
        removeOnFail: 50,
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000
        }
      }
    })
    
    this.setupWorkers()
  }
  
  private setupWorkers() {
    // Video processing worker (limited concurrency)
    new Worker('video-processing', async (job: Job) => {
      const processor = new VideoProcessor()
      
      // Update progress callback
      const onProgress = (progress: number) => {
        this.updateJobProgress(job.id!, progress)
        job.updateProgress(progress)
      }
      
      return processor.process(job.data, onProgress)
    }, {
      connection: this.redis,
      concurrency: 2, // Limited for resource-intensive operations
      limiter: {
        max: 5,
        duration: 60000 // 5 jobs per minute
      }
    })
    
    // Audio processing worker (higher concurrency)
    new Worker('audio-processing', async (job: Job) => {
      const processor = new AudioProcessor()
      
      const onProgress = (progress: number) => {
        this.updateJobProgress(job.id!, progress)
        job.updateProgress(progress)
      }
      
      return processor.process(job.data, onProgress)
    }, {
      connection: this.redis,
      concurrency: 5,
      limiter: {
        max: 20,
        duration: 60000
      }
    })
  }
  
  async queueVideoJob(data: VideoJobData, priority = 0): Promise<string> {
    const job = await this.videoQueue.add('process', data, {
      priority,
      delay: 0
    })
    
    this.initializeJobProgress(job.id!, {
      type: 'video',
      status: 'queued',
      progress: 0,
      startTime: Date.now()
    })
    
    return job.id!
  }
  
  async queueAudioJob(data: AudioJobData, priority = 0): Promise<string> {
    const job = await this.audioQueue.add('process', data, {
      priority
    })
    
    this.initializeJobProgress(job.id!, {
      type: 'audio',
      status: 'queued',
      progress: 0,
      startTime: Date.now()
    })
    
    return job.id!
  }
  
  private updateJobProgress(jobId: string, progress: number) {
    const current = this.progressTracker.get(jobId)
    if (current) {
      current.progress = progress
      current.status = progress === 100 ? 'completed' : 'processing'
      current.lastUpdate = Date.now()
      
      // Emit progress update via WebSocket
      this.emitProgressUpdate(jobId, current)
    }
  }
  
  async getJobStatus(jobId: string): Promise<JobStatus | null> {
    const progress = this.progressTracker.get(jobId)
    if (!progress) return null
    
    // Try to get job from queues
    const videoJob = await this.videoQueue.getJob(jobId)
    const audioJob = await this.audioQueue.getJob(jobId)
    const job = videoJob || audioJob
    
    if (!job) return null
    
    return {
      id: jobId,
      status: await job.getState(),
      progress: progress.progress,
      data: job.data,
      result: job.returnvalue,
      error: job.failedReason,
      createdAt: new Date(job.timestamp),
      processedAt: job.processedOn ? new Date(job.processedOn) : null,
      finishedAt: job.finishedOn ? new Date(job.finishedOn) : null,
      estimatedTimeRemaining: this.calculateTimeRemaining(progress)
    }
  }
}
```

### Real-time Progress Updates
```typescript
class ProgressWebSocketServer {
  private io: SocketIOServer
  
  constructor(server: Server) {
    this.io = new SocketIOServer(server, {
      cors: { origin: "*" },
      path: '/media-progress'
    })
    
    this.setupEventHandlers()
  }
  
  private setupEventHandlers() {
    this.io.on('connection', (socket) => {
      console.log('Client connected for progress updates')
      
      socket.on('subscribe-job', (jobId: string) => {
        socket.join(`job:${jobId}`)
        console.log(`Client subscribed to job: ${jobId}`)
      })
      
      socket.on('unsubscribe-job', (jobId: string) => {
        socket.leave(`job:${jobId}`)
      })
      
      socket.on('disconnect', () => {
        console.log('Client disconnected')
      })
    })
  }
  
  emitProgress(jobId: string, progress: JobProgress) {
    this.io.to(`job:${jobId}`).emit('progress', {
      jobId,
      progress: progress.progress,
      status: progress.status,
      stage: progress.stage,
      eta: progress.estimatedTimeRemaining,
      timestamp: Date.now()
    })
  }
  
  emitComplete(jobId: string, result: ProcessingResult) {
    this.io.to(`job:${jobId}`).emit('complete', {
      jobId,
      downloadUrl: result.downloadUrl,
      filename: result.filename,
      size: result.size,
      duration: result.processingDuration,
      timestamp: Date.now()
    })
  }
  
  emitError(jobId: string, error: string) {
    this.io.to(`job:${jobId}`).emit('error', {
      jobId,
      error,
      timestamp: Date.now()
    })
  }
}
```

---

## 🚀 Deployment Configuration

### GPU-Enabled Dockerfile
```dockerfile
FROM nvidia/cuda:12.0-devel-ubuntu22.04

# Install Node.js
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs

# Install FFmpeg with GPU support
RUN apt-get update && apt-get install -y \
    ffmpeg \
    handbrake-cli \
    sox \
    mediainfo \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Verify GPU support
RUN ffmpeg -encoders | grep nvenc || echo "No GPU encoders found"

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .
RUN npm run build

# Create temp directory
RUN mkdir -p /tmp/media-processing && \
    chmod 777 /tmp/media-processing

# Health check
HEALTHCHECK --interval=30s --timeout=15s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:3001/health || exit 1

EXPOSE 3001

USER node

CMD ["node", "dist/index.js"]
```

### Docker Compose with GPU Support
```yaml
version: '3.8'

services:
  media-converter:
    build: .
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
      - REDIS_URL=redis://redis:6379
      - GPU_ENABLED=true
      - MAX_FILE_SIZE=2GB
      - TEMP_DIR=/tmp/media-processing
    volumes:
      - /tmp:/tmp
    depends_on:
      - redis
    restart: unless-stopped
    deploy:
      resources:
        limits:
          memory: 4G
          cpus: '2.0'
        reservations:
          memory: 1G
          cpus: '1.0'
    # GPU support (uncomment if available)
    # runtime: nvidia
    # environment:
    #   - NVIDIA_VISIBLE_DEVICES=all

  redis:
    image: redis:7-alpine
    ports:
      - "6380:6379"
    volumes:
      - redis_data:/data
    command: redis-server --maxmemory 512mb --maxmemory-policy allkeys-lru

volumes:
  redis_data:
```

---

## 📊 Performance Monitoring

### Media-Specific Metrics
```typescript
class MediaMetrics {
  private metrics = {
    conversionsTotal: new Counter({
      name: 'media_conversions_total',
      help: 'Total media conversions',
      labelNames: ['type', 'format', 'status', 'gpu_used']
    }),
    
    processingDuration: new Histogram({
      name: 'media_processing_duration_seconds',
      help: 'Media processing duration',
      labelNames: ['type', 'format'],
      buckets: [1, 5, 10, 30, 60, 300, 600, 1800, 3600]
    }),
    
    fileSizeInput: new Histogram({
      name: 'media_input_size_bytes',
      help: 'Input file sizes',
      buckets: [1e6, 10e6, 50e6, 100e6, 500e6, 1e9, 2e9, 5e9]
    }),
    
    compressionRatio: new Histogram({
      name: 'media_compression_ratio',
      help: 'Compression ratio (output/input)',
      buckets: [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0]
    }),
    
    queueLength: new Gauge({
      name: 'media_queue_length',
      help: 'Current queue length',
      labelNames: ['queue_type']
    }),
    
    gpuUtilization: new Gauge({
      name: 'gpu_utilization_percent',
      help: 'GPU utilization percentage'
    })
  }
  
  recordConversion(
    type: 'video' | 'audio',
    format: string,
    duration: number,
    inputSize: number,
    outputSize: number,
    gpuUsed: boolean,
    success: boolean
  ) {
    this.metrics.conversionsTotal.inc({
      type,
      format,
      status: success ? 'success' : 'error',
      gpu_used: gpuUsed.toString()
    })
    
    if (success) {
      this.metrics.processingDuration.observe({ type, format }, duration)
      this.metrics.fileSizeInput.observe(inputSize)
      
      if (outputSize > 0) {
        const ratio = outputSize / inputSize
        this.metrics.compressionRatio.observe(ratio)
      }
    }
  }
  
  updateQueueMetrics(videoQueueLength: number, audioQueueLength: number) {
    this.metrics.queueLength.set({ queue_type: 'video' }, videoQueueLength)
    this.metrics.queueLength.set({ queue_type: 'audio' }, audioQueueLength)
  }
  
  async updateGPUMetrics() {
    if (process.env.GPU_ENABLED === 'true') {
      try {
        const result = await execAsync('nvidia-smi --query-gpu=utilization.gpu --format=csv,noheader,nounits')
        const utilization = parseInt(result.stdout.trim())
        this.metrics.gpuUtilization.set(utilization)
      } catch (error) {
        console.warn('Failed to get GPU metrics:', error.message)
      }
    }
  }
}
```

---

## 🎯 API Endpoints

### REST API
```typescript
// Queue media conversion
POST /api/convert
Content-Type: multipart/form-data
{
  file: <binary>,
  outputFormat: "mp4" | "mp3" | "wav" | ...,
  options: ConversionOptions
}
Response: { jobId, estimatedTime, statusUrl }

// Get job status
GET /api/jobs/:jobId/status
Response: { status, progress, downloadUrl?, error?, eta? }

// Get real-time progress (WebSocket)
WS /media-progress
Events: progress, complete, error

// Download converted file
GET /api/download/:id
Response: Binary file with streaming support

// Get media file information
POST /api/analyze
Content-Type: multipart/form-data
{ file: <binary> }
Response: { format, duration, size, codecs, recommendations }

// Health check with GPU status
GET /health
Response: { status, services: [...], gpu: { available, utilization } }
```

---

## ✅ Success Criteria

### Performance Targets
- **Video Conversion**: < 2x real-time (1 min video → 2 min processing)
- **Audio Conversion**: < 0.5x real-time (1 min audio → 30 sec processing)
- **Memory Usage**: < 4GB per container
- **GPU Utilization**: > 80% when available
- **Success Rate**: > 98% for supported formats

### Quality Metrics
- **Video Quality**: SSIM > 0.95 for same-resolution conversions
- **Audio Quality**: SNR > 40dB for lossy conversions
- **File Size**: Optimal compression ratios per format
- **Processing Speed**: GPU acceleration 3-5x faster than CPU

This specification provides a complete blueprint for a production-ready media conversion service with GPU acceleration, real-time progress tracking, and enterprise-grade performance monitoring.