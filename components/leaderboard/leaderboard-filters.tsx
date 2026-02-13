"use client"

import { Button } from "@/components/ui/button"
import type { Timeframe } from "@/lib/hooks/useLeaderboard"

interface LeaderboardFiltersProps {
  timeframe: Timeframe
  onTimeframeChange: (timeframe: Timeframe) => void
}

export function LeaderboardFilters({ timeframe, onTimeframeChange }: LeaderboardFiltersProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {(["weekly", "monthly", "all-time"] as const).map((tf) => (
        <Button
          key={tf}
          onClick={() => onTimeframeChange(tf)}
          variant={timeframe === tf ? "default" : "outline"}
          className={
            timeframe === tf ? "bg-primary text-white" : "border-border/50 bg-transparent bg-accent/9"
          }
        >
          {tf === "weekly" ? "This Week" : tf === "monthly" ? "This Month" : "All Time"}
        </Button>
      ))}
    </div>
  )
}
