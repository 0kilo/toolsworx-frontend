import { getSessionId } from './session-id'

interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetAt: Date
}

// Client-side rate limit check (optimistic)
export function checkClientRateLimit(toolId: string, limit: number = 3): RateLimitResult {
  if (typeof window === 'undefined') {
    return { allowed: true, remaining: limit, resetAt: new Date() }
  }

  const sessionId = getSessionId()
  const key = `rate_limit_${toolId}_${sessionId}`
  const now = Date.now()
  
  // Get stored usage data
  const stored = localStorage.getItem(key)
  let usage: { count: number; resetAt: number } = stored 
    ? JSON.parse(stored) 
    : { count: 0, resetAt: now + 24 * 60 * 60 * 1000 } // 24 hours

  // Reset if expired
  if (now > usage.resetAt) {
    usage = { count: 0, resetAt: now + 24 * 60 * 60 * 1000 }
  }

  const remaining = Math.max(0, limit - usage.count)
  const allowed = usage.count < limit

  return {
    allowed,
    remaining,
    resetAt: new Date(usage.resetAt)
  }
}

// Increment usage count
export function incrementUsage(toolId: string): void {
  if (typeof window === 'undefined') return

  const sessionId = getSessionId()
  const key = `rate_limit_${toolId}_${sessionId}`
  const now = Date.now()
  
  const stored = localStorage.getItem(key)
  let usage: { count: number; resetAt: number } = stored 
    ? JSON.parse(stored) 
    : { count: 0, resetAt: now + 24 * 60 * 60 * 1000 }

  // Reset if expired
  if (now > usage.resetAt) {
    usage = { count: 0, resetAt: now + 24 * 60 * 60 * 1000 }
  }

  usage.count++
  localStorage.setItem(key, JSON.stringify(usage))
}

// Get remaining uses
export function getRemainingUses(toolId: string, limit: number = 3): number {
  const result = checkClientRateLimit(toolId, limit)
  return result.remaining
}

// Format time until reset
export function getTimeUntilReset(resetAt: Date): string {
  const now = new Date()
  const diff = resetAt.getTime() - now.getTime()
  
  if (diff <= 0) return 'now'
  
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }
  return `${minutes}m`
}
