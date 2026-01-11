"use client"

import { Progress } from "@/components/ui/progress"

interface QuizProgressProps {
  current: number
  total: number
  timeRemaining: number
}

export function QuizProgress({ current, total, timeRemaining }: QuizProgressProps) {
  const progress = (current / total) * 100
  const isTimeRunningOut = timeRemaining < 60

  const minutes = Math.floor(timeRemaining / 60)
  const seconds = timeRemaining % 60

  return (
    <div className="space-y-4">
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">
            Question {current} of {total}
          </span>
          <span
            className={`text-sm font-semibold transition-colors ${
              isTimeRunningOut ? "text-destructive" : "text-primary"
            }`}
          >
            {minutes}:{seconds.toString().padStart(2, "0")}
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>
    </div>
  )
}
