import { ConverterMetadata } from "@/types/converter"

/**
 * Media Converters Registry
 * Consolidated media conversion tools using FFmpeg
 */
export const mediaConverterTools: ConverterMetadata[] = [
  // Backend-dependent tools temporarily disabled while Cloud Run backend is offline.
  // Uncomment entries below to re-enable media converters.
  // {
  //   id: "image-converter",
  //   title: "Image Converter",
  //   description: "Convert between JPG, PNG, WebP, GIF, and other image formats",
  //   category: "image",
  //   icon: ImageIcon,
  //   href: "/media-converters/image",
  //   keywords: ["jpg", "png", "webp", "gif", "image", "photo", "convert"],
  //   popular: true,
  // },
  // {
  //   id: "audio-converter",
  //   title: "Audio Converter",
  //   description: "Convert between MP3, WAV, FLAC, AAC, and other audio formats",
  //   category: "audio",
  //   icon: Music,
  //   href: "/media-converters/audio",
  //   keywords: ["mp3", "wav", "flac", "aac", "ogg", "audio", "convert"],
  //   popular: true,
  // },
  // {
  //   id: "video-converter",
  //   title: "Video Converter",
  //   description: "Convert between MP4, AVI, MKV, MOV, and other video formats",
  //   category: "video",
  //   icon: Video,
  //   href: "/media-converters/video",
  //   keywords: ["mp4", "avi", "mkv", "mov", "webm", "video", "convert"],
  //   popular: true,
  // },
  // Speech to Text - Temporarily disabled until OpenAI API budget available
  // Uncomment to re-enable:
  // {
  //   id: "speech-to-text",
  //   title: "Speech to Text",
  //   description: "Convert speech to text in real-time with support for 30+ languages",
  //   category: "audio",
  //   icon: Mic,
  //   href: "/media-converters/speech-to-text",
  //   keywords: ["speech", "text", "transcribe", "voice", "dictation", "audio", "recognition", "stt"],
  //   popular: true,
  // },

]
