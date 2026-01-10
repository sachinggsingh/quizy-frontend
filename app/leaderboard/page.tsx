"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { LeaderboardTable } from "@/components/leaderboard-table"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const mockLeaderboard = [
  {
    rank: 1,
    name: "Alex Chen",
    avatar: "A",
    score: 15240,
    quizzesCompleted: 48,
    averageScore: 94,
  },
  {
    rank: 2,
    name: "Sarah Johnson",
    avatar: "S",
    score: 14890,
    quizzesCompleted: 45,
    averageScore: 92,
  },
  {
    rank: 3,
    name: "Michael Brown",
    avatar: "M",
    score: 14520,
    quizzesCompleted: 44,
    averageScore: 91,
  },
  {
    rank: 4,
    name: "Emma Wilson",
    avatar: "E",
    score: 13950,
    quizzesCompleted: 42,
    averageScore: 89,
  },
  {
    rank: 5,
    name: "David Martinez",
    avatar: "D",
    score: 13420,
    quizzesCompleted: 40,
    averageScore: 87,
  },
  {
    rank: 6,
    name: "Lisa Anderson",
    avatar: "L",
    score: 12890,
    quizzesCompleted: 38,
    averageScore: 85,
  },
  {
    rank: 7,
    name: "James Taylor",
    avatar: "J",
    score: 12340,
    quizzesCompleted: 36,
    averageScore: 83,
  },
  {
    rank: 8,
    name: "Jennifer Lee",
    avatar: "J",
    score: 11890,
    quizzesCompleted: 34,
    averageScore: 81,
  },
  {
    rank: 9,
    name: "Robert Garcia",
    avatar: "R",
    score: 11450,
    quizzesCompleted: 32,
    averageScore: 79,
  },
  {
    rank: 10,
    name: "You",
    avatar: "U",
    score: 10920,
    quizzesCompleted: 30,
    averageScore: 78,
    isCurrentUser: true,
  },
]

type Timeframe = "weekly" | "monthly" | "all-time"

export default function LeaderboardPage() {
  const [timeframe, setTimeframe] = useState<Timeframe>("all-time")

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
                <p className="text-4xl font-bold text-primary">#10</p>
                <p className="text-xs text-muted-foreground mt-2">Out of 50,000+ users</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-card/50">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-muted-foreground text-sm mb-2">Your Points</p>
                <p className="text-4xl font-bold text-primary">10,920</p>
                <p className="text-xs text-muted-foreground mt-2">+450 this week</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-card/50">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-muted-foreground text-sm mb-2">Next Milestone</p>
                <p className="text-4xl font-bold text-primary">11,300</p>
                <p className="text-xs text-muted-foreground mt-2">380 points to go</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Timeframe Filters */}
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
        <LeaderboardTable data={mockLeaderboard} timeframe={timeframe} />

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
