"use client"

import { Flame, Calendar } from "lucide-react"
import { useEffect, useState } from "react"

interface StreakDay {
  date: string
  completed: boolean
  count?: number
}

interface StreakDisplayProps {
  user: any
}

export function StreakDisplay({ user }: StreakDisplayProps) {
  const [streakWeeks, setStreakWeeks] = useState<StreakDay[][]>([])

  useEffect(() => {
    if (!user) return

    // Generate last 365 days of streak data
    const allDays: StreakDay[] = []
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    for (let i = 364; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      
      // Format as YYYY-MM-DD in local time
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const dateStr = `${year}-${month}-${day}`
      
      const count = (user.activity && user.activity[dateStr]) || 0
      
      allDays.push({
        date: dateStr,
        completed: count > 0,
        count: count,
      })
    }

    // Group into weeks
    const weeks: StreakDay[][] = []
    for (let i = 0; i < allDays.length; i += 7) {
      weeks.push(allDays.slice(i, i + 7))
    }

    setStreakWeeks(weeks)
  }, [user])

  const currentStreak = user?.streak || 0
  const longestStreak = user?.streak || 0 // For now, since we only have one streak field
  const completedThisYear = streakWeeks.flat().filter((d) => d.completed).length

  const getIntensityColor = (count?: number) => {
    if (count === undefined || count === 0) return "bg-muted/20 hover:bg-muted/30"
    if (count === 1) return "bg-primary/25 hover:bg-primary/35"
    if (count === 2) return "bg-primary/45 hover:bg-primary/55"
    if (count === 3) return "bg-primary/65 hover:bg-primary/75"
    return "bg-primary hover:bg-primary/95"
  }

  if (!user) return null

  return (
    <div className="space-y-6">
      {/* Streak Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 rounded-lg blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
          <div className="relative bg-card border border-border rounded-lg p-4 hover:border-primary/40 transition-colors shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Current Streak</p>
                <p className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-red-500">
                  {currentStreak}
                </p>
                <p className="text-xs text-muted-foreground mt-1">days active</p>
              </div>
              <Flame className="w-8 h-8 text-orange-500 animate-pulse" />
            </div>
          </div>
        </div>

        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500 rounded-lg blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
          <div className="relative bg-card border border-border rounded-lg p-4 hover:border-primary/40 transition-colors shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Longest Streak</p>
                <p className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 to-orange-500">
                  {longestStreak}
                </p>
                <p className="text-xs text-muted-foreground mt-1">best record</p>
              </div>
              <Flame className="w-8 h-8 text-yellow-500" />
            </div>
          </div>
        </div>

        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-purple-600 rounded-lg blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
          <div className="relative bg-card border border-border rounded-lg p-4 hover:border-primary/40 transition-colors shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Total Completed</p>
                <p className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                  {completedThisYear}
                </p>
                <p className="text-xs text-muted-foreground mt-1">this year</p>
              </div>
              <Calendar className="w-8 h-8 text-primary" />
            </div>
          </div>
        </div>
      </div>

      {/* GitHub Style Contribution Graph - Exact Replica */}
      <div className="bg-card border border-border rounded-lg p-6 hover:border-primary/40 transition-colors shadow-md">
        <h3 className="text-sm font-semibold mb-4 text-foreground">Your activity</h3>

        <div className="overflow-x-auto no-scrollbar pb-4">
          <div className="inline-flex gap-1">
            {streakWeeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-1">
                {week.map((day, dayIndex) => {
                  const dayDate = new Date(day.date + "T00:00:00")
                  const dayName = dayDate.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    weekday: "short",
                  })
                  const count = day.count || 0

                  return (
                    <div
                      key={dayIndex}
                      className={`w-4 h-4 rounded-sm transition-all duration-200 cursor-pointer group relative border border-border/30 ${getIntensityColor(
                        count,
                      )}`}
                      title={`${dayName}: ${count} completed`}
                    >
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-card border border-border/50 rounded px-2.5 py-1.5 text-xs whitespace-nowrap z-50 pointer-events-none shadow-lg">
                        <div className="font-medium">{count} completed</div>
                        <div className="text-muted-foreground text-xs">{dayName}</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 flex items-center gap-2 text-xs">
          <span className="text-muted-foreground font-medium">Less</span>
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-muted/20 border border-border/30"></div>
            <div className="w-3 h-3 rounded-sm bg-primary/25 border border-border/30"></div>
            <div className="w-3 h-3 rounded-sm bg-primary/45 border border-border/30"></div>
            <div className="w-3 h-3 rounded-sm bg-primary/65 border border-border/30"></div>
            <div className="w-3 h-3 rounded-sm bg-primary border border-border/30"></div>
          </div>
          <span className="text-muted-foreground font-medium">More</span>
        </div>
      </div>
    </div>
  )
}
