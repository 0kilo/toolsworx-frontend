"use client"

import { cn } from "@/lib/utils"

interface IndeterminateProgressProps {
  className?: string
  barClassName?: string
}

export function IndeterminateProgress({ className, barClassName }: IndeterminateProgressProps) {
  return (
    <div className={cn("relative h-4 w-full overflow-hidden rounded-full bg-secondary", className)}>
      <div className={cn("indeterminate-progress-bar absolute inset-y-0 w-1/3 rounded-full bg-primary", barClassName)} />
    </div>
  )
}
