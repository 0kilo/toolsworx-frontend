/**
 * Client-side rate limiter for file transcriptions
 * Limits: 3 transcriptions per 24 hours
 */

const STORAGE_KEY = 'tw_transcription_usage';
const MAX_TRANSCRIPTIONS = 3;
const WINDOW_MS = 24 * 60 * 60 * 1000; // 24 hours

interface TranscriptionUsage {
  count: number;
  resetTime: number;
  timestamps: number[];
}

export class TranscriptionLimiter {
  /**
   * Check if transcription is allowed
   */
  static canTranscribe(): { allowed: boolean; remaining: number; resetTime: number } {
    const usage = this.getUsage();
    const now = Date.now();

    // Reset if window expired
    if (now > usage.resetTime) {
      this.reset();
      return {
        allowed: true,
        remaining: MAX_TRANSCRIPTIONS - 1,
        resetTime: now + WINDOW_MS,
      };
    }

    // Check if limit exceeded
    if (usage.count >= MAX_TRANSCRIPTIONS) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: usage.resetTime,
      };
    }

    return {
      allowed: true,
      remaining: MAX_TRANSCRIPTIONS - usage.count,
      resetTime: usage.resetTime,
    };
  }

  /**
   * Record a transcription
   */
  static recordTranscription(): void {
    const usage = this.getUsage();
    const now = Date.now();

    // Reset if window expired
    if (now > usage.resetTime) {
      this.saveUsage({
        count: 1,
        resetTime: now + WINDOW_MS,
        timestamps: [now],
      });
      return;
    }

    // Increment count
    usage.count++;
    usage.timestamps.push(now);

    this.saveUsage(usage);
  }

  /**
   * Get current usage status
   */
  static getStatus(): { used: number; remaining: number; resetTime: number; limit: number } {
    const usage = this.getUsage();
    const now = Date.now();

    // Reset if window expired
    if (now > usage.resetTime) {
      return {
        used: 0,
        remaining: MAX_TRANSCRIPTIONS,
        resetTime: now + WINDOW_MS,
        limit: MAX_TRANSCRIPTIONS,
      };
    }

    return {
      used: usage.count,
      remaining: Math.max(0, MAX_TRANSCRIPTIONS - usage.count),
      resetTime: usage.resetTime,
      limit: MAX_TRANSCRIPTIONS,
    };
  }

  /**
   * Reset the usage counter
   */
  static reset(): void {
    const now = Date.now();
    this.saveUsage({
      count: 0,
      resetTime: now + WINDOW_MS,
      timestamps: [],
    });
  }

  /**
   * Get stored usage data
   */
  private static getUsage(): TranscriptionUsage {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        return this.getDefaultUsage();
      }

      const usage = JSON.parse(stored) as TranscriptionUsage;

      // Validate structure
      if (typeof usage.count !== 'number' || typeof usage.resetTime !== 'number') {
        return this.getDefaultUsage();
      }

      return usage;
    } catch {
      return this.getDefaultUsage();
    }
  }

  /**
   * Save usage data
   */
  private static saveUsage(usage: TranscriptionUsage): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(usage));
    } catch (error) {
      console.error('Failed to save transcription usage:', error);
    }
  }

  /**
   * Get default usage object
   */
  private static getDefaultUsage(): TranscriptionUsage {
    const now = Date.now();
    return {
      count: 0,
      resetTime: now + WINDOW_MS,
      timestamps: [],
    };
  }
}
