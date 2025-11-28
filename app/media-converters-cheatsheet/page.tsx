import { Metadata } from 'next'
import { generateSEO } from '@/lib/seo'
import { CheatSheet } from '@/components/shared/cheat-sheet'

export const metadata: Metadata = generateSEO({
  title: 'Media Conversion Cheat Sheet - Audio, Video & Image Formats',
  description: 'Complete guide to media formats, codecs, and conversion settings for images, audio, and video files.',
  keywords: [
    'media conversion guide',
    'video formats',
    'audio formats',
    'image formats',
    'codec guide',
    'compression settings'
  ],
  canonical: 'https://toolsworx.com/media-converters-cheatsheet',
})

const cheatSheetContent = `
# Media Conversion Quick Reference

## Image Formats

### JPEG/JPG
- **Best for:** Photos, web images
- **Compression:** Lossy
- **Transparency:** No
- **Animation:** No
- **Quality vs Size:** Excellent balance

### PNG
- **Best for:** Graphics with transparency, screenshots
- **Compression:** Lossless
- **Transparency:** Yes (alpha channel)
- **Animation:** No
- **Quality vs Size:** Larger files, perfect quality

### WebP
- **Best for:** Modern web applications
- **Compression:** Lossy/Lossless
- **Transparency:** Yes
- **Animation:** Yes
- **Quality vs Size:** 25-35% smaller than JPEG

### GIF
- **Best for:** Simple animations, logos
- **Compression:** Lossless (256 colors max)
- **Transparency:** Yes (1-bit)
- **Animation:** Yes
- **Quality vs Size:** Limited colors

### SVG
- **Best for:** Scalable graphics, icons
- **Type:** Vector format
- **Scalability:** Infinite
- **File Size:** Very small for simple graphics

## Audio Formats

### MP3
- **Compression:** Lossy
- **Quality:** Good (128-320 kbps)
- **Compatibility:** Universal
- **Best for:** Music, podcasts

### WAV
- **Compression:** Uncompressed
- **Quality:** Perfect
- **File Size:** Large
- **Best for:** Professional audio, editing

### FLAC
- **Compression:** Lossless
- **Quality:** Perfect
- **File Size:** ~50% of WAV
- **Best for:** Audiophiles, archiving

### AAC
- **Compression:** Lossy
- **Quality:** Better than MP3 at same bitrate
- **Compatibility:** Good (Apple devices)
- **Best for:** Streaming, mobile

### OGG Vorbis
- **Compression:** Lossy
- **Quality:** Excellent
- **Compatibility:** Limited
- **Best for:** Open-source projects

## Video Formats

### MP4 (H.264)
- **Compression:** Lossy
- **Quality:** Excellent
- **Compatibility:** Universal
- **Best for:** Web, mobile, streaming

### AVI
- **Container:** Can hold various codecs
- **Quality:** Depends on codec
- **Compatibility:** Good
- **Best for:** Windows systems

### MKV
- **Container:** Matroska
- **Features:** Multiple audio/subtitle tracks
- **Quality:** Excellent
- **Best for:** High-quality video storage

### MOV
- **Developer:** Apple
- **Quality:** High
- **Compatibility:** Mac-focused
- **Best for:** Professional video editing

### WebM
- **Compression:** VP8/VP9
- **Quality:** Good
- **Best for:** Web streaming
- **Compatibility:** Modern browsers

## Conversion Guidelines

### Image Conversion Rules

| From | To | When | Quality Loss |
|------|----|----- |--------------|
| PNG | JPEG | Web optimization | Yes (transparency lost) |
| JPEG | PNG | Need transparency | No |
| Any | WebP | Modern web | Minimal |
| GIF | MP4 | Better animation | No |

### Audio Conversion Settings

#### For Music
- **High Quality:** 320 kbps MP3 or FLAC
- **Standard:** 192-256 kbps MP3
- **Streaming:** 128 kbps AAC
- **Podcasts:** 64-128 kbps MP3

#### Sample Rates
- **CD Quality:** 44.1 kHz, 16-bit
- **Professional:** 48 kHz, 24-bit
- **High-Res:** 96 kHz, 24-bit

### Video Conversion Settings

#### Resolution Guidelines
- **4K:** 3840×2160 (Ultra HD)
- **1080p:** 1920×1080 (Full HD)
- **720p:** 1280×720 (HD)
- **480p:** 854×480 (SD)

#### Bitrate Recommendations
| Resolution | H.264 Bitrate | H.265 Bitrate |
|------------|---------------|---------------|
| 4K | 25-40 Mbps | 15-25 Mbps |
| 1080p | 8-12 Mbps | 5-8 Mbps |
| 720p | 5-8 Mbps | 3-5 Mbps |
| 480p | 2-5 Mbps | 1-3 Mbps |

## Codec Information

### Video Codecs
- **H.264 (AVC):** Most compatible, good quality
- **H.265 (HEVC):** Better compression, newer devices
- **VP9:** Google's codec, web-focused
- **AV1:** Next-gen, excellent compression

### Audio Codecs
- **AAC:** Apple standard, good quality
- **MP3:** Universal compatibility
- **Opus:** Modern, excellent for voice
- **Vorbis:** Open-source alternative

## Quality vs File Size

### Image Optimization
\`\`\`
JPEG Quality Settings:
- 95-100: Maximum quality (large files)
- 85-95: High quality (recommended)
- 75-85: Good quality (web standard)
- 60-75: Acceptable quality
- <60: Poor quality (avoid)
\`\`\`

### Compression Comparison
For a 10MB original image:
- **PNG:** ~10MB (lossless)
- **JPEG 90%:** ~2MB
- **JPEG 75%:** ~800KB
- **WebP 80%:** ~600KB

## Best Practices

### Before Converting
1. **Keep original files**
2. **Choose appropriate format**
3. **Consider end use**
4. **Test quality**

### Batch Conversion Tips
- **Consistent settings** across files
- **Organize** by format/quality
- **Verify** random samples
- **Document** conversion settings

### Common Mistakes to Avoid
- Converting lossy to lossy formats repeatedly
- Using wrong aspect ratios
- Over-compressing images
- Ignoring color profiles
- Not considering device compatibility

*Note: Advanced codec settings and professional workflows will be added soon.*
`

export default function MediaConvertersCheatSheetPage() {
  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <CheatSheet
            title="Media Conversion Cheat Sheet"
            description="Essential guide to audio, video, and image format conversion"
            content={cheatSheetContent}
            category="media-converters"
          />
        </div>
        <div className="lg:col-span-1">
        </div>
      </div>
    </div>
  )
}