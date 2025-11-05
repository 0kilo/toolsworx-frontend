/**
 * RATE LIMITING SYSTEM
 *
 * Prevents abuse of resource-intensive operations by limiting
 * the number of operations a user can perform per day.
 *
 * Usage:
 * - File conversions: Limit to 10 per day
 * - Media conversions: Limit to 5 per day
 * - Heavy calculations: Limit to 50 per day
 */

// ========================================
// TYPES
// ========================================

export interface RateLimitConfig {
  operation: string // e.g., "file-conversion", "video-conversion"
  maxRequests: number // Max requests per time window
  windowMs: number // Time window in milliseconds (default: 24 hours)
}

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetTime: Date
  message?: string
}

// ========================================
// PREDEFINED LIMITS
// ========================================

export const RATE_LIMITS = {
  FILE_CONVERSION: {
    operation: "file-conversion",
    maxRequests: 10,
    windowMs: 24 * 60 * 60 * 1000, // 24 hours
  },
  VIDEO_CONVERSION: {
    operation: "video-conversion",
    maxRequests: 5,
    windowMs: 24 * 60 * 60 * 1000,
  },
  IMAGE_CONVERSION: {
    operation: "image-conversion",
    maxRequests: 20,
    windowMs: 24 * 60 * 60 * 1000,
  },
  AUDIO_CONVERSION: {
    operation: "audio-conversion",
    maxRequests: 15,
    windowMs: 24 * 60 * 60 * 1000,
  },
  HEAVY_CALCULATION: {
    operation: "heavy-calculation",
    maxRequests: 50,
    windowMs: 24 * 60 * 60 * 1000,
  },
}

// ========================================
// USER IDENTIFICATION
// ========================================

/**
 * Get unique identifier for user
 * Priority: 1) User ID (if authenticated), 2) IP address, 3) Browser fingerprint
 */
export function getUserIdentifier(request?: Request): string {
  if (typeof window === "undefined") {
    // Server-side: Use IP address or headers
    if (request) {
      const forwarded = request.headers.get("x-forwarded-for")
      const ip = forwarded ? forwarded.split(",")[0] : request.headers.get("x-real-ip")
      return ip || "unknown"
    }
    return "unknown"
  }

  // Client-side: Use browser fingerprint
  const fingerprint = getBrowserFingerprint()
  return fingerprint
}

/**
 * Generate browser fingerprint from available data
 */
function getBrowserFingerprint(): string {
  const data = [
    navigator.userAgent,
    navigator.language,
    screen.width,
    screen.height,
    screen.colorDepth,
    new Date().getTimezoneOffset(),
  ].join("|")

  // Simple hash function
  let hash = 0
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32-bit integer
  }

  return `fp_${Math.abs(hash).toString(36)}`
}

// ========================================
// LOCAL STORAGE RATE LIMITER (CLIENT-SIDE)
// ========================================

/**
 * Check rate limit using localStorage (client-side only)
 * For production, use server-side with Redis or database
 */
export function checkRateLimit(config: RateLimitConfig): RateLimitResult {
  if (typeof window === "undefined") {
    // Server-side: Allow by default, implement proper rate limiting with Redis
    console.warn("Rate limiting should be implemented server-side with Redis/DB")
    return {
      allowed: true,
      remaining: config.maxRequests,
      resetTime: new Date(Date.now() + config.windowMs),
    }
  }

  const userId = getUserIdentifier()
  const key = `ratelimit:${config.operation}:${userId}`

  // Get existing data
  const stored = localStorage.getItem(key)
  let data: { count: number; resetTime: number } | null = null

  if (stored) {
    try {
      data = JSON.parse(stored)
    } catch {
      data = null
    }
  }

  const now = Date.now()

  // Check if window has expired
  if (!data || !data.resetTime || now > data.resetTime) {
    // Start new window
    data = {
      count: 0,
      resetTime: now + config.windowMs,
    }
  }

  // Check if limit exceeded
  if (data.count >= config.maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: new Date(data.resetTime),
      message: `Rate limit exceeded. You can make ${config.maxRequests} ${config.operation} requests per day. Try again after ${new Date(data.resetTime).toLocaleString()}.`,
    }
  }

  // Increment count
  data.count++
  localStorage.setItem(key, JSON.stringify(data))

  return {
    allowed: true,
    remaining: config.maxRequests - data.count,
    resetTime: new Date(data.resetTime),
  }
}

/**
 * Record a rate limited operation (increment counter)
 */
export function recordOperation(config: RateLimitConfig): void {
  if (typeof window === "undefined") return

  const userId = getUserIdentifier()
  const key = `ratelimit:${config.operation}:${userId}`

  const stored = localStorage.getItem(key)
  let data: { count: number; resetTime: number } | null = null

  if (stored) {
    try {
      data = JSON.parse(stored)
    } catch {
      data = null
    }
  }

  const now = Date.now()

  if (!data || now > (data.resetTime || 0)) {
    data = {
      count: 1,
      resetTime: now + config.windowMs,
    }
  } else {
    data.count++
  }

  localStorage.setItem(key, JSON.stringify(data))
}

/**
 * Get current usage for an operation
 */
export function getRateLimitStatus(config: RateLimitConfig): {
  used: number
  remaining: number
  resetTime: Date
} {
  if (typeof window === "undefined") {
    return {
      used: 0,
      remaining: config.maxRequests,
      resetTime: new Date(Date.now() + config.windowMs),
    }
  }

  const userId = getUserIdentifier()
  const key = `ratelimit:${config.operation}:${userId}`

  const stored = localStorage.getItem(key)
  let data: { count: number; resetTime: number } | null = null

  if (stored) {
    try {
      data = JSON.parse(stored)
    } catch {
      data = null
    }
  }

  const now = Date.now()

  if (!data || now > (data.resetTime || 0)) {
    return {
      used: 0,
      remaining: config.maxRequests,
      resetTime: new Date(now + config.windowMs),
    }
  }

  return {
    used: data.count,
    remaining: Math.max(0, config.maxRequests - data.count),
    resetTime: new Date(data.resetTime),
  }
}

/**
 * Reset rate limit for testing/admin purposes
 */
export function resetRateLimit(config: RateLimitConfig): void {
  if (typeof window === "undefined") return

  const userId = getUserIdentifier()
  const key = `ratelimit:${config.operation}:${userId}`
  localStorage.removeItem(key)
}

// ========================================
// SERVER-SIDE RATE LIMITING (FOR PRODUCTION)
// ========================================

/**
 * Server-side rate limiting using Redis (for production)
 *
 * Install: npm install ioredis
 *
 * Example usage in API route:
 *
 * import { Redis } from 'ioredis'
 * const redis = new Redis(process.env.REDIS_URL)
 *
 * export async function POST(request: Request) {
 *   const result = await checkRateLimitRedis(
 *     redis,
 *     RATE_LIMITS.FILE_CONVERSION,
 *     request
 *   )
 *
 *   if (!result.allowed) {
 *     return Response.json(
 *       { error: result.message },
 *       { status: 429 }
 *     )
 *   }
 *
 *   // Process request...
 * }
 */

export async function checkRateLimitRedis(
  redis: any, // Redis client
  config: RateLimitConfig,
  request: Request
): Promise<RateLimitResult> {
  const userId = getUserIdentifier(request)
  const key = `ratelimit:${config.operation}:${userId}`

  try {
    // Increment counter
    const count = await redis.incr(key)

    // Set expiry on first request
    if (count === 1) {
      await redis.pexpire(key, config.windowMs)
    }

    // Get TTL for reset time
    const ttl = await redis.pttl(key)
    const resetTime = new Date(Date.now() + ttl)

    // Check if limit exceeded
    if (count > config.maxRequests) {
      return {
        allowed: false,
        remaining: 0,
        resetTime,
        message: `Rate limit exceeded. Maximum ${config.maxRequests} requests per day. Resets at ${resetTime.toLocaleString()}.`,
      }
    }

    return {
      allowed: true,
      remaining: config.maxRequests - count,
      resetTime,
    }
  } catch (error) {
    console.error("Redis rate limit error:", error)
    // Fail open (allow request) if Redis is down
    return {
      allowed: true,
      remaining: config.maxRequests,
      resetTime: new Date(Date.now() + config.windowMs),
    }
  }
}

// ========================================
// REACT HOOK
// ========================================

import { useState, useEffect } from "react"

/**
 * React hook for rate limiting
 */
export function useRateLimit(config: RateLimitConfig) {
  const [status, setStatus] = useState(() => getRateLimitStatus(config))

  useEffect(() => {
    const interval = setInterval(() => {
      setStatus(getRateLimitStatus(config))
    }, 1000) // Update every second

    return () => clearInterval(interval)
  }, [config])

  const check = (): RateLimitResult => {
    const result = checkRateLimit(config)
    setStatus(getRateLimitStatus(config))
    return result
  }

  const record = (): void => {
    recordOperation(config)
    setStatus(getRateLimitStatus(config))
  }

  const reset = (): void => {
    resetRateLimit(config)
    setStatus(getRateLimitStatus(config))
  }

  return {
    ...status,
    check,
    record,
    reset,
  }
}

// ========================================
// UI COMPONENTS
// ========================================

/**
 * Rate limit warning component
 */
export function RateLimitWarning({
  config,
  className = "",
}: {
  config: RateLimitConfig
  className?: string
}) {
  const status = getRateLimitStatus(config)

  if (status.remaining > 5) return null

  return (
    <div className={`bg-yellow-50 border border-yellow-200 rounded-lg p-4 ${className}`}>
      <p className="text-sm text-yellow-800">
        <strong>Warning:</strong> You have {status.remaining} {config.operation}{" "}
        operations remaining today. Resets at {status.resetTime.toLocaleTimeString()}.
      </p>
    </div>
  )
}

/**
 * Rate limit exceeded component
 */
export function RateLimitExceeded({
  config,
  resetTime,
}: {
  config: RateLimitConfig
  resetTime: Date
}) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
      <h3 className="text-lg font-semibold text-red-900 mb-2">
        Daily Limit Reached
      </h3>
      <p className="text-sm text-red-700 mb-4">
        You've reached your daily limit of {config.maxRequests} {config.operation}{" "}
        operations.
      </p>
      <p className="text-sm text-red-700">
        Your limit will reset at{" "}
        <strong>{resetTime.toLocaleString()}</strong>
      </p>
      <p className="text-xs text-red-600 mt-4">
        Need more? Consider upgrading to our premium plan for unlimited access.
      </p>
    </div>
  )
}
