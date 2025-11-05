import Redis from 'ioredis'
import { config } from '../config'

export class RateLimiter {
  private redis: Redis

  constructor() {
    this.redis = new Redis(config.redisUrl)
  }

  async checkLimit(
    key: string,
    tier: 'anonymous' | 'registered' | 'premium'
  ): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
    const limits = config.rateLimits[tier]
    const limit = limits.requestsPerHour
    const window = 3600 // 1 hour in seconds

    const rateLimitKey = `ratelimit:${tier}:${key}`
    const now = Date.now()
    const windowStart = now - window * 1000

    // Remove old entries
    await this.redis.zremrangebyscore(rateLimitKey, 0, windowStart)

    // Count current requests
    const currentCount = await this.redis.zcard(rateLimitKey)

    // Add current request
    await this.redis.zadd(rateLimitKey, now, `${now}-${Math.random()}`)

    // Set expiration
    await this.redis.expire(rateLimitKey, window)

    return {
      allowed: currentCount < limit,
      remaining: Math.max(0, limit - currentCount - 1),
      resetTime: now + window * 1000,
    }
  }
}
