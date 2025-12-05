"use client"

import { useState, useEffect } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Clock } from "lucide-react"
import { checkClientRateLimit, getTimeUntilReset } from "@/lib/utils/rate-limiter"

interface RateLimitGuardProps {
  toolId: string
  limit?: number
  children: React.ReactNode
}

export function RateLimitGuard({ toolId, limit = 3, children }: RateLimitGuardProps) {
  const [rateLimit, setRateLimit] = useState({ allowed: true, remaining: limit, resetAt: new Date() })

  useEffect(() => {
    const result = checkClientRateLimit(toolId, limit)
    setRateLimit(result)
  }, [toolId, limit])

  if (!rateLimit.allowed) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Daily Limit Reached</AlertTitle>
        <AlertDescription>
          You've reached the daily limit of {limit} uses for this tool. 
          This limit helps us manage server costs for resource-intensive operations.
          <div className="flex items-center gap-2 mt-2">
            <Clock className="h-4 w-4" />
            <span className="text-sm">
              Resets in {getTimeUntilReset(rateLimit.resetAt)}
            </span>
          </div>
        </AlertDescription>
      </Alert>
    )
  }

  if (rateLimit.remaining <= 1) {
    return (
      <>
        <Alert className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Usage Warning</AlertTitle>
          <AlertDescription>
            You have {rateLimit.remaining} use{rateLimit.remaining !== 1 ? 's' : ''} remaining today.
            Resets in {getTimeUntilReset(rateLimit.resetAt)}.
          </AlertDescription>
        </Alert>
        {children}
      </>
    )
  }

  return <>{children}</>
}
