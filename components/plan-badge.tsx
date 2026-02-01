"use client"

import { Crown, Zap, User } from "lucide-react"

export type PlanType = "free" | "pro" | "enterprise"

interface PlanBadgeProps {
  plan: PlanType
  showLabel?: boolean
  size?: "sm" | "md" | "lg"
  className?: string
}

const sizeClasses = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-6 w-6",
}

const labelByPlan: Record<PlanType, string> = {
  free: "Free",
  pro: "Pro",
  enterprise: "Enterprise",
}

export function PlanBadge({ plan, showLabel = true, size = "md", className = "" }: PlanBadgeProps) {
  const iconSize = sizeClasses[size]

  if (plan === "enterprise") {
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 px-2.5 py-1 text-sm font-medium ${className}`}
        title="Enterprise"
      >
        <Crown className={iconSize} aria-hidden />
        {showLabel && <span>{labelByPlan.enterprise}</span>}
      </span>
    )
  }

  if (plan === "pro") {
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full bg-primary/15 text-primary px-2.5 py-1 text-sm font-medium ${className}`}
        title="Pro"
      >
        <Zap className={iconSize} aria-hidden />
        {showLabel && <span>{labelByPlan.pro}</span>}
      </span>
    )
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full bg-muted text-muted-foreground px-2.5 py-1 text-sm font-medium ${className}`}
      title="Free"
    >
      <User className={iconSize} aria-hidden />
      {showLabel && <span>{labelByPlan.free}</span>}
    </span>
  )
}
