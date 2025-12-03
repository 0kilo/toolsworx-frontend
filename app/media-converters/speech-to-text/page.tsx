"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { AboutDescription } from "@/components/ui/about-description"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Mic, MicOff, Copy, Download, Trash2, AlertCircle, Upload, Loader2 } from "lucide-react"
import { SpeechToText, SUPPORTED_LANGUAGES } from "@/lib/utils/speech-to-text"
import { TranscriptionLimiter } from "@/lib/utils/transcription-limiter"
import { Badge } from "@/components/ui/badge"
import { FileDropzone } from "@/components/shared/file-dropzone"

export default function SpeechToTextPage() {
  const [transcript, setTranscript] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState("en-US")
  const [error, setError] = useState<string | null>(null)
  const [isSupported, setIsSupported] = useState(true)
  const [wordCount, setWordCount] = useState(0)
  const [characterCount, setCharacterCount] = useState(0)

  // File upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isTranscribing, setIsTranscribing] = useState(false)
  const [transcriptionStatus, setTranscriptionStatus] = useState<{
    used: number;
    remaining: number;
    resetTime: number;
  } | null>(null)

  const speechToTextRef = useRef<SpeechToText | null>(null)

  useEffect(() => {
    setIsSupported(SpeechToText.isSupported())
    if (!SpeechToText.isSupported()) {
      setError("Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.")
    }

    // Load transcription status
    updateTranscriptionStatus()
  }, [])

  useEffect(() => {
    const words = transcript.trim().split(/\s+/).filter(w => w.length > 0)
    setWordCount(words.length)
    setCharacterCount(transcript.length)
  }, [transcript])

  const updateTranscriptionStatus = () => {
    const status = TranscriptionLimiter.getStatus()
    setTranscriptionStatus(status)
  }

  // LIVE RECORDING HANDLERS
  const handleStartRecording = () => {
    setError(null)

    speechToTextRef.current = new SpeechToText({
      language: selectedLanguage,
      continuous: true,
      interimResults: true,
      onResult: (text, isFinal) => {
        setTranscript(text)
      },
      onError: (errorMessage) => {
        setError(errorMessage)
        setIsRecording(false)
      },
      onEnd: () => {
        setIsRecording(false)
      },
      onStart: () => {
        setIsRecording(true)
      }
    })

    speechToTextRef.current.start()
  }

  const handleStopRecording = () => {
    speechToTextRef.current?.stop()
    setIsRecording(false)
  }

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language)
    if (isRecording) {
      speechToTextRef.current?.setLanguage(language)
    }
  }

  // FILE UPLOAD HANDLERS
  const handleFileSelect = (file: File) => {
    setSelectedFile(file)
    setError(null)
  }

  const handleFileTranscribe = async () => {
    if (!selectedFile) return

    // Check rate limit
    const limitCheck = TranscriptionLimiter.canTranscribe()
    if (!limitCheck.allowed) {
      const resetDate = new Date(limitCheck.resetTime)
      setError(`Daily limit reached (3 transcriptions per 24 hours). Resets at ${resetDate.toLocaleString()}`)
      return
    }

    setIsTranscribing(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('file', selectedFile)

      // Convert language code to ISO 639-1 (2-letter code) for OpenAI
      const langCode = selectedLanguage.split('-')[0]
      formData.append('language', langCode)

      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Transcription failed')
      }

      const result = await response.json()
      setTranscript(result.text)

      // Record successful transcription
      TranscriptionLimiter.recordTranscription()
      updateTranscriptionStatus()

    } catch (err: any) {
      setError(err.message || 'Failed to transcribe audio file')
    } finally {
      setIsTranscribing(false)
    }
  }

  // COMMON HANDLERS
  const handleClear = () => {
    setTranscript("")
    setError(null)
    setSelectedFile(null)
    speechToTextRef.current?.reset()
  }

  const handleCopy = async () => {
    if (transcript) {
      try {
        await navigator.clipboard.writeText(transcript)
      } catch (err) {
        setError("Failed to copy to clipboard")
      }
    }
  }

  const handleDownload = () => {
    if (transcript) {
      const blob = new Blob([transcript], { type: "text/plain" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `transcript-${Date.now()}.txt`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }

  const selectedLangInfo = SUPPORTED_LANGUAGES.find(l => l.code === selectedLanguage)
  const resetDate = transcriptionStatus ? new Date(transcriptionStatus.resetTime) : null

  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Speech to Text Converter</h1>
            <p className="text-muted-foreground">
              Convert speech to text in real-time with support for 30+ languages
            </p>
          </div>

          {!isSupported && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari for the best experience.
              </AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mic className="h-5 w-5" />
                Speech Recognition
              </CardTitle>
              <CardDescription>
                Choose between live microphone recording (unlimited) or upload audio files (3 per day)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Tabs defaultValue="live" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="live">
                    <Mic className="h-4 w-4 mr-2" />
                    Live Recording (Unlimited)
                  </TabsTrigger>
                  <TabsTrigger value="upload">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload File ({transcriptionStatus?.remaining || 0}/3 left)
                  </TabsTrigger>
                </TabsList>

                {/* LIVE RECORDING TAB */}
                <TabsContent value="live" className="space-y-4 mt-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <label className="text-sm font-medium mb-2 block">
                        Select Language
                      </label>
                      <Select
                        value={selectedLanguage}
                        onValueChange={handleLanguageChange}
                        disabled={isRecording}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {SUPPORTED_LANGUAGES.map((lang) => (
                            <SelectItem key={lang.code} value={lang.code}>
                              {lang.flag} {lang.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-end gap-2">
                      <Button
                        size="lg"
                        onClick={isRecording ? handleStopRecording : handleStartRecording}
                        variant={isRecording ? "destructive" : "default"}
                        disabled={!isSupported}
                        className="flex-1 sm:flex-none"
                      >
                        {isRecording ? (
                          <>
                            <MicOff className="mr-2 h-5 w-5" />
                            Stop Recording
                          </>
                        ) : (
                          <>
                            <Mic className="mr-2 h-5 w-5" />
                            Start Recording
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  {isRecording && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                        <span>Recording in {selectedLangInfo?.name || selectedLanguage}</span>
                      </div>
                    </div>
                  )}
                </TabsContent>

                {/* FILE UPLOAD TAB */}
                <TabsContent value="upload" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Upload Audio File
                    </label>
                    <FileDropzone
                      accept="audio/mpeg,audio/wav,audio/flac,audio/m4a,audio/ogg,.mp3,.wav,.flac,.m4a,.ogg"
                      maxSize={25}
                      onFileSelect={handleFileSelect}
                    />
                    {selectedFile && (
                      <div className="text-sm text-muted-foreground">
                        Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <label className="text-sm font-medium mb-2 block">
                      Select Language
                    </label>
                    <Select
                      value={selectedLanguage}
                      onValueChange={setSelectedLanguage}
                      disabled={isTranscribing}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {SUPPORTED_LANGUAGES.map((lang) => (
                          <SelectItem key={lang.code} value={lang.code}>
                            {lang.flag} {lang.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    size="lg"
                    onClick={handleFileTranscribe}
                    disabled={!selectedFile || isTranscribing || (transcriptionStatus?.remaining === 0)}
                    className="w-full"
                  >
                    {isTranscribing ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Transcribing...
                      </>
                    ) : (
                      <>
                        <Upload className="mr-2 h-5 w-5" />
                        Transcribe File
                      </>
                    )}
                  </Button>

                  {transcriptionStatus && (
                    <div className="text-xs text-muted-foreground text-center">
                      {transcriptionStatus.remaining > 0 ? (
                        <span>
                          {transcriptionStatus.remaining} transcription{transcriptionStatus.remaining !== 1 ? 's' : ''} remaining today.
                          Resets at {resetDate?.toLocaleTimeString()}
                        </span>
                      ) : (
                        <span className="text-destructive font-medium">
                          Daily limit reached. Resets at {resetDate?.toLocaleString()}
                        </span>
                      )}
                    </div>
                  )}
                </TabsContent>
              </Tabs>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Transcript</label>
                  <div className="flex gap-4 text-xs text-muted-foreground">
                    <Badge variant="outline">{wordCount} words</Badge>
                    <Badge variant="outline">{characterCount} characters</Badge>
                  </div>
                </div>
                <Textarea
                  value={transcript}
                  onChange={(e) => setTranscript(e.target.value)}
                  placeholder="Your speech will appear here as text..."
                  className="min-h-[300px] font-mono text-sm"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  onClick={handleCopy}
                  disabled={!transcript}
                >
                  <Copy className="mr-2 h-4 w-4" />
                  Copy to Clipboard
                </Button>
                <Button
                  variant="outline"
                  onClick={handleDownload}
                  disabled={!transcript}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download as TXT
                </Button>
                <Button
                  variant="outline"
                  onClick={handleClear}
                  disabled={!transcript && !isRecording && !selectedFile}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Clear
                </Button>
              </div>
            </CardContent>
          </Card>

          <AboutDescription
            title="About Speech to Text"
            description="Convert spoken words into written text using advanced speech recognition technology. Perfect for transcription, note-taking, and accessibility."
            sections={[
              {
                title: "Two Transcription Modes",
                content: [
                  "Live Recording - Unlimited real-time transcription through your microphone (100% FREE)",
                  "File Upload - Upload audio files for high-accuracy transcription (3 per 24 hours)",
                  "Live mode uses browser Web Speech API (instant, no cost)",
                  "File mode uses OpenAI Whisper (higher accuracy, better quality)",
                ]
              },
              {
                title: "Supported Languages",
                content: [
                  "English (US, UK) - Most accurate recognition",
                  "Vietnamese (Tiếng Việt) - Full tone support",
                  "Chinese (Mandarin, Cantonese, Traditional)",
                  "Spanish (Spain, Mexico) - Multiple dialects",
                  "French, German, Italian, Portuguese",
                  "Japanese, Korean, Thai, Indonesian",
                  "Arabic, Hindi, Russian, Turkish",
                  "And 20+ additional languages"
                ]
              },
              {
                title: "File Upload Features",
                content: [
                  "Supported formats: MP3, WAV, FLAC, M4A, OGG",
                  "Maximum file size: 25MB",
                  "Limit: 3 transcriptions per 24 hours",
                  "Powered by OpenAI Whisper for best accuracy",
                  "Files are not stored - processed and discarded immediately",
                  "Counter resets every 24 hours"
                ]
              },
              {
                title: "Common Use Cases",
                content: [
                  "Meeting notes and transcription",
                  "Dictation for writing and emails",
                  "Accessibility for hands-free input",
                  "Language learning and pronunciation practice",
                  "Interview transcription",
                  "Voice memos and quick notes",
                  "Podcast and video transcription",
                  "Subtitle creation for videos"
                ]
              },
              {
                title: "Tips for Best Results",
                content: [
                  "Live Mode: Use a good quality microphone",
                  "Live Mode: Minimize background noise",
                  "File Mode: Clear audio yields better transcriptions",
                  "Speak clearly and at a moderate pace",
                  "Ensure stable internet connection",
                  "Allow microphone permissions when prompted (live mode)",
                  "Use Chrome, Edge, or Safari for best support",
                  "Different languages may have varying accuracy levels"
                ]
              },
              {
                title: "Privacy & Cost",
                content: [
                  "Live mode: 100% FREE, unlimited use",
                  "File mode: 3 transcriptions per 24 hours",
                  "Audio files are NOT stored on our servers",
                  "Files processed by OpenAI Whisper API",
                  "Live audio processed by browser speech recognition",
                  "Transcripts remain in your browser session",
                  "Download or copy your transcript before closing the page"
                ]
              }
            ]}
          />
        </div>

        <div className="lg:col-span-1">
        </div>
      </div>
    </div>
  )
}
