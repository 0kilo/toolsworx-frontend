"use client"

import { RateLimitConfig, getRateLimitStatus } from "@/lib/rate-limit"

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
        <strong>Warning:</strong> You have {status.remaining} {config.operation} operations remaining today. Resets at {status.resetTime.toLocaleTimeString()}.
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
        You&apos;ve reached your daily limit of {config.maxRequests} {config.operation} operations.
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