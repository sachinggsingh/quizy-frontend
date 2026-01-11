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

export function ActivityFeed() {
  const activities: ActivityItem[] = [
    {
      id: "1",
      type: "completed",
      quiz: "Advanced JavaScript",
      score: 92,
      date: "2 hours ago",
    },
    {
      id: "2",
      type: "completed",
      quiz: "React Hooks Deep Dive",
      score: 85,
      date: "1 day ago",
    },
    {
      id: "3",
      type: "failed",
      quiz: "TypeScript Generics",
      score: 65,
      date: "2 days ago",
    },
    {
      id: "4",
      type: "completed",
      quiz: "CSS Grid Master",
      score: 95,
      date: "3 days ago",
    },
  ]

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-card/80 to-card/40">
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
              <p className="text-sm font-medium text-foreground">{activity.quiz}</p>
              <p className="text-xs text-muted-foreground">{activity.date}</p>
            </div>
            {activity.score && (
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
