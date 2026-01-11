"use client"

import { useState, useEffect } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { LeaderboardTable } from "@/components/leaderboard-table"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useAppSelector } from "@/lib/hooks"

type Timeframe = "weekly" | "monthly" | "all-time"

export default function LeaderboardPage() {
  const [timeframe, setTimeframe] = useState<Timeframe>("all-time")
  const [leaderboardData, setLeaderboardData] = useState<any[]>([])
  const { user: currentUser } = useAppSelector((state) => state.auth)

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080/ws/leaderboard")

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        if (Array.isArray(data)) {
          const mappedData = data.map((user: any, index: number) => ({
            rank: index + 1,
            name: user.name,
            avatar: user.name?.split(" ").map((n: string) => n[0]).join("").toUpperCase() || "?",
            score: user.score,
            quizzesCompleted: user.completedQuizzes || 0,
            averageScore: Math.round(user.averageScore || 0),
            isCurrentUser: user.id === currentUser?.id,
          }))
          setLeaderboardData(mappedData)
        }
      } catch (err) {
        console.error("Failed to parse leaderboard data:", err)
      }
    }

    return () => {
      ws.close()
    }
  }, [currentUser])

  const userStats = leaderboardData.find(u => u.isCurrentUser) || {
    rank: currentUser?.rank || "-",
    score: currentUser?.score || 0
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Global Leaderboard</h1>
          <p className="text-muted-foreground">Compete with quiz enthusiasts around the world</p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="border-primary/20 bg-card/50">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-muted-foreground text-sm mb-2">Your Rank</p>
                <p className="text-4xl font-bold text-primary">#{userStats.rank}</p>
                <p className="text-xs text-muted-foreground mt-2">Global rating</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-card/50">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-muted-foreground text-sm mb-2">Your Points</p>
                <p className="text-4xl font-bold text-primary">{userStats.score.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground mt-2">Cumulative score</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-card/50">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-muted-foreground text-sm mb-2">Total Quizzes</p>
                <p className="text-4xl font-bold text-primary">{currentUser?.completedQuizzes || 0}</p>
                <p className="text-xs text-muted-foreground mt-2">Finished assessments</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Timeframe Filters (Placeholder logic as backend only supports all-time for now) */}
        <div className="flex flex-wrap gap-2 mb-6">
          {(["weekly", "monthly", "all-time"] as const).map((tf) => (
            <Button
              key={tf}
              onClick={() => setTimeframe(tf)}
              variant={timeframe === tf ? "default" : "outline"}
              className={
                timeframe === tf
                  ? "bg-primary text-primary-foreground"
                  : "border-border/50 bg-transparent hover:bg-accent/5"
              }
            >
              {tf === "weekly" ? "This Week" : tf === "monthly" ? "This Month" : "All Time"}
            </Button>
          ))}
        </div>

        {/* Leaderboard Table */}
        <LeaderboardTable data={leaderboardData} timeframe={timeframe} />

        {/* Bottom CTA */}
        <div className="mt-8 text-center">
          <p className="text-muted-foreground mb-4">
            Keep grinding to climb the leaderboard and unlock exclusive rewards!
          </p>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">Take a Quiz to Earn Points</Button>
        </div>
      </main>
    </div>
  )
}
