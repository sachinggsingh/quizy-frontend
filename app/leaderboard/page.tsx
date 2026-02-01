"use client"

import { useState, useEffect } from "react"
import { LeaderboardTable } from "@/components/leaderboard-table"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useAppSelector } from "@/lib/hooks"
import { useLeaderboardWs } from "@/lib/hooks/useLeaderboardWs"
import { useRouter } from "next/navigation"
import Link from "next/link"

type Timeframe = "weekly" | "monthly" | "all-time"

export default function LeaderboardPage() {
  const [timeframe, setTimeframe] = useState<Timeframe>("all-time")
  const [mounted, setMounted] = useState(false)
  const { isAuthenticated } = useAppSelector((state) => state.auth)
  const { leaderboardData, userStats, currentUser } = useLeaderboardWs()
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && !isAuthenticated) {
      router.push("/sign-in")
    }
  }, [mounted, isAuthenticated, router])

  if (!mounted || !isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground mb-2">Global Leaderboard</h1>
          <p className="text-muted-foreground">Compete with quiz enthusiasts around the world</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mx-auto mb-4">
          <Card className="border-primary/20 bg-card/50">
            <CardContent className="pt-4">
              <div className="text-center">
                <p className="text-center text-muted-foreground text-sm mb-2">Your Rank</p>
                <p className="text-center text-4xl font-bold text-primary">#{userStats.rank}</p>
                <p className="text-center text-xs text-muted-foreground mt-2">Global rating</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-primary/20 bg-card/50">
            <CardContent className="pt-4">
              <div className="text-center">
                <p className="text-center text-muted-foreground text-sm mb-2">Your Points</p>
                <p className="text-center text-4xl font-bold text-primary">
                  {Number(userStats.score).toLocaleString()}
                </p>
                <p className="text-center text-xs text-muted-foreground mt-2">Cumulative score</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-primary/20 bg-card/50">
            <CardContent className="pt-4">
              <div className="text-center">
                <p className="text-center text-muted-foreground text-sm mb-2">Total Quizzes</p>
                <p className="text-center text-4xl font-bold text-primary">
                  {currentUser?.completedQuizzes ?? 0}
                </p>
                <p className="text-center text-xs text-muted-foreground mt-2">Finished assessments</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {(["weekly", "monthly", "all-time"] as const).map((tf) => (
            <Button
              key={tf}
              onClick={() => setTimeframe(tf)}
              variant={timeframe === tf ? "default" : "outline"}
              className={
                timeframe === tf ? "bg-primary text-white" : "border-border/50 bg-transparent bg-accent/9"
              }
            >
              {tf === "weekly" ? "This Week" : tf === "monthly" ? "This Month" : "All Time"}
            </Button>
          ))}
        </div>

        <LeaderboardTable data={leaderboardData} timeframe={timeframe} />

        <div className="mt-8 text-center">
          <p className="text-muted-foreground mb-4">
            Keep grinding to climb the leaderboard and unlock exclusive rewards!
          </p>
          <Button className="bg-primary text-white transition-all duration-300" asChild>
            <Link href="/dashboard">Take a Quiz to Earn Points</Link>
          </Button>
        </div>
      </main>
    </div>
  )
}
