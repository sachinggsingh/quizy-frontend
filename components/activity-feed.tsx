"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, AlertCircle } from "lucide-react"

interface ActivityItem {
  id: string
  type: "completed" | "failed"
  quiz: string
  score?: number
  date: string
}

interface ActivityFeedProps {
  activities?: any[]
}

export function ActivityFeed({ activities = [] }: ActivityFeedProps) {
  // If no activities, could show a placeholder or nothing
  if (activities.length === 0) {
    return (
      <Card className="border-border bg-card shadow-md">
        <CardHeader>
          <CardTitle className="text-lg">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-4">No recent activity found.</p>
        </CardContent>
      </Card>
    )
  }

  // Helper to format date relative (simplified)
  const formatRelativeDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    if (days === 0) return "Today"
    if (days === 1) return "Yesterday"
    return `${days} days ago`
  }

  return (
    <Card className="border-border bg-card shadow-md">
      <CardHeader>
        <CardTitle className="text-lg">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-center gap-3 pb-3 border-b border-border/30 last:border-0">
            <div className={`p-2 rounded-lg ${activity.type === "completed" ? "bg-green-500/10" : "bg-red-500/10"}`}>
              {activity.type === "completed" ? (
                <CheckCircle2 className="w-5 h-5 text-green-500" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-500" />
              )}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">{activity.quizTitle}</p>
              <p className="text-xs text-muted-foreground">{formatRelativeDate(activity.date)}</p>
            </div>
            {activity.score !== undefined && (
              <div className="text-right">
                <p className="text-sm font-bold text-primary">{activity.score}%</p>
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
