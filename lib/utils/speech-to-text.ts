/**
 * Speech to Text Utility
 * Web Speech API wrapper for multi-language speech recognition
 */

export interface SpeechToTextConfig {
  language?: string;
  continuous?: boolean;
  interimResults?: boolean;
  onResult: (text: string, isFinal: boolean) => void;
  onError?: (error: string) => void;
  onEnd?: () => void;
  onStart?: () => void;
}

export interface SupportedLanguage {
  code: string;
  name: string;
  flag: string;
}

export class SpeechToText {
  private recognition: any;
  private isListening = false;
  private finalTranscript = '';
  private interimTranscript = '';

  constructor(private config: SpeechToTextConfig) {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      config.onError?.('Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    this.recognition = new SpeechRecognition();
    this.recognition.continuous = config.continuous ?? true;
    this.recognition.interimResults = config.interimResults ?? true;
    this.recognition.lang = config.language || 'en-US';
    this.recognition.maxAlternatives = 1;

    this.recognition.onstart = () => {
      this.isListening = true;
      config.onStart?.();
    };

    this.recognition.onresult = (event: any) => {
      this.interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;

        if (event.results[i].isFinal) {
          this.finalTranscript += transcript + ' ';
          config.onResult(this.finalTranscript.trim(), true);
        } else {
          this.interimTranscript += transcript;
          config.onResult(
            (this.finalTranscript + this.interimTranscript).trim(),
            false
          );
        }
      }
    };

    this.recognition.onerror = (event: any) => {
      let errorMessage = 'An error occurred during speech recognition';

      switch (event.error) {
        case 'no-speech':
          errorMessage = 'No speech detected. Please try again.';
          break;
        case 'audio-capture':
          errorMessage = 'No microphone found. Please ensure your microphone is connected.';
          break;
        case 'not-allowed':
          errorMessage = 'Microphone permission denied. Please allow microphone access.';
          break;
        case 'network':
          errorMessage = 'Network error. Please check your internet connection.';
          break;
        case 'aborted':
          errorMessage = 'Speech recognition was aborted.';
          break;
        default:
          errorMessage = `Speech recognition error: ${event.error}`;
      }

      config.onError?.(errorMessage);
    };

    this.recognition.onend = () => {
      this.isListening = false;
      config.onEnd?.();
    };
  }

  start() {
    if (!this.isListening && this.recognition) {
      try {
        this.finalTranscript = '';
        this.interimTranscript = '';
        this.recognition.start();
      } catch (error: any) {
        // Handle "already started" error by recreating the recognition object
        if (error.message?.includes('already started')) {
          this.recreateRecognition();
          setTimeout(() => {
            try {
              this.recognition?.start();
            } catch (retryError) {
              this.config.onError?.('Failed to start speech recognition. Please try again.');
            }
          }, 100);
        } else {
          this.config.onError?.('Failed to start speech recognition. Please try again.');
        }
      }
    }
  }

  stop() {
    if (this.isListening && this.recognition) {
      try {
        this.recognition.stop();
      } catch (error) {
        // Ignore errors when stopping
        this.isListening = false;
      }
    }
  }

  abort() {
    if (this.recognition) {
      try {
        this.recognition.abort();
      } catch (error) {
        // Ignore errors when aborting
      }
      this.isListening = false;
    }
  }

  private recreateRecognition() {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      return;
    }

    // Clean up old instance
    if (this.recognition) {
      try {
        this.recognition.abort();
      } catch (e) {
        // Ignore
      }
      this.recognition.onstart = null;
      this.recognition.onresult = null;
      this.recognition.onerror = null;
      this.recognition.onend = null;
    }

    // Create new instance with same config
    this.recognition = new SpeechRecognition();
    this.recognition.continuous = this.config.continuous ?? true;
    this.recognition.interimResults = this.config.interimResults ?? true;
    this.recognition.lang = this.config.language || 'en-US';
    this.recognition.maxAlternatives = 1;

    // Re-attach event handlers
    this.recognition.onstart = () => {
      this.isListening = true;
      this.config.onStart?.();
    };

    this.recognition.onresult = (event: any) => {
      this.interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;

        if (event.results[i].isFinal) {
          this.finalTranscript += transcript + ' ';
          this.config.onResult(this.finalTranscript.trim(), true);
        } else {
          this.interimTranscript += transcript;
          this.config.onResult(
            (this.finalTranscript + this.interimTranscript).trim(),
            false
          );
        }
      }
    };

    this.recognition.onerror = (event: any) => {
      let errorMessage = 'An error occurred during speech recognition';

      switch (event.error) {
        case 'no-speech':
          errorMessage = 'No speech detected. Please try again.';
          break;
        case 'audio-capture':
          errorMessage = 'No microphone found. Please ensure your microphone is connected.';
          break;
        case 'not-allowed':
          errorMessage = 'Microphone permission denied. Please allow microphone access.';
          break;
        case 'network':
          errorMessage = 'Network error. Please check your internet connection.';
          break;
        case 'aborted':
          // Don't show error for aborted
          return;
        default:
          errorMessage = `Speech recognition error: ${event.error}`;
      }

      this.config.onError?.(errorMessage);
    };

    this.recognition.onend = () => {
      this.isListening = false;
      this.config.onEnd?.();
    };
  }

  setLanguage(language: string) {
    if (this.recognition) {
      const wasListening = this.isListening;
      if (wasListening) {
        this.stop();
      }
      this.recognition.lang = language;
      if (wasListening) {
        // Give a small delay before restarting
        setTimeout(() => this.start(), 100);
      }
    }
  }

  isActive() {
    return this.isListening;
  }

  reset() {
    this.finalTranscript = '';
    this.interimTranscript = '';
  }

  static isSupported(): boolean {
    return !!(
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition
    );
  }
}

/**
 * Supported languages for speech recognition
 */
export const SUPPORTED_LANGUAGES: SupportedLanguage[] = [
  { code: 'en-US', name: 'English (US)', flag: '🇺🇸' },
  { code: 'en-GB', name: 'English (UK)', flag: '🇬🇧' },
  { code: 'vi-VN', name: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'zh-CN', name: '中文 (普通话)', flag: '🇨🇳' },
  { code: 'zh-HK', name: '中文 (粵語)', flag: '🇭🇰' },
  { code: 'zh-TW', name: '中文 (台灣)', flag: '🇹🇼' },
  { code: 'es-ES', name: 'Español (España)', flag: '🇪🇸' },
  { code: 'es-MX', name: 'Español (México)', flag: '🇲🇽' },
  { code: 'fr-FR', name: 'Français', flag: '🇫🇷' },
  { code: 'de-DE', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'it-IT', name: 'Italiano', flag: '🇮🇹' },
  { code: 'ja-JP', name: '日本語', flag: '🇯🇵' },
  { code: 'ko-KR', name: '한국어', flag: '🇰🇷' },
  { code: 'pt-BR', name: 'Português (Brasil)', flag: '🇧🇷' },
  { code: 'pt-PT', name: 'Português (Portugal)', flag: '🇵🇹' },
  { code: 'ru-RU', name: 'Русский', flag: '🇷🇺' },
  { code: 'ar-SA', name: 'العربية', flag: '🇸🇦' },
  { code: 'hi-IN', name: 'हिन्दी', flag: '🇮🇳' },
  { code: 'th-TH', name: 'ไทย', flag: '🇹🇭' },
  { code: 'id-ID', name: 'Bahasa Indonesia', flag: '🇮🇩' },
  { code: 'tr-TR', name: 'Türkçe', flag: '🇹🇷' },
  { code: 'pl-PL', name: 'Polski', flag: '🇵🇱' },
  { code: 'nl-NL', name: 'Nederlands', flag: '🇳🇱' },
  { code: 'sv-SE', name: 'Svenska', flag: '🇸🇪' },
  { code: 'da-DK', name: 'Dansk', flag: '🇩🇰' },
  { code: 'fi-FI', name: 'Suomi', flag: '🇫🇮' },
  { code: 'no-NO', name: 'Norsk', flag: '🇳🇴' },
  { code: 'cs-CZ', name: 'Čeština', flag: '🇨🇿' },
  { code: 'el-GR', name: 'Ελληνικά', flag: '🇬🇷' },
  { code: 'he-IL', name: 'עברית', flag: '🇮🇱' },
  { code: 'uk-UA', name: 'Українська', flag: '🇺🇦' },
];
