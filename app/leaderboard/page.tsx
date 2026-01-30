"use client"

import { useState, useEffect } from "react"

import { LeaderboardTable } from "@/components/leaderboard-table"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useAppSelector } from "@/lib/hooks"
import { useRouter } from "next/navigation"
import Link from "next/link"

type Timeframe = "weekly" | "monthly" | "all-time"

export default function LeaderboardPage() {
  const [timeframe, setTimeframe] = useState<Timeframe>("all-time")
  const [leaderboardData, setLeaderboardData] = useState<any[]>([])
  const { user: currentUser, isAuthenticated } = useAppSelector((state) => state.auth)
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && !isAuthenticated) {
      router.push("/sign-in")
    }
  }, [mounted, isAuthenticated, router])

  useEffect(() => {
    let socket: WebSocket | null = null
    let reconnectTimeout: NodeJS.Timeout
    let isMounted = true

      const connect = () => {
        if (!isMounted) return

        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080"
        // Ensure backendUrl doesn't have a trailing slash
        const cleanBackendUrl = backendUrl.replace(/\/$/, "")
        // Replace http/https with ws/wss
        const wsProtocol = cleanBackendUrl.startsWith("https") ? "wss" : "ws"
        const wsBaseUrl = cleanBackendUrl.replace(/^https?:\/\//, "")
        const wsUrl = `${wsProtocol}://${wsBaseUrl}/ws/leaderboard`
      
      console.log("Connecting to Leaderboard WebSocket:", wsUrl)
      const ws = new WebSocket(wsUrl)
      socket = ws

      ws.onmessage = (event) => {
        try {
          // Identify if it's a wrapped message or raw array
          const message = JSON.parse(event.data)
          
          let users: any[] = []
          if (message.type === "LEADERBOARD_UPDATE" && Array.isArray(message.data)) {
             users = message.data
          } else if (Array.isArray(message)) {
             users = message
          }

          if (users.length > 0) {
            const mappedData = users.map((user: any, index: number) => ({
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

      ws.onerror = (err) => {
        console.error("Leaderboard WebSocket error:", err)
      }

      ws.onclose = (event) => {
        console.log("Leaderboard WebSocket closed:", event.code, event.reason)
        // Only reconnect if the closure wasn't intentional (not 1000 or 1001, and still mounted)
        if (isMounted && event.code !== 1000 && event.code !== 1001) {
          reconnectTimeout = setTimeout(connect, 3000)
        }
      }
    }

    if (mounted && isAuthenticated) {
      connect()
    }

    return () => {
      isMounted = false
      if (socket) {
        socket.close(1000, "Component unmounting")
      }
      clearTimeout(reconnectTimeout)
    }
  }, [mounted, isAuthenticated, currentUser?.id])

  const userStats = leaderboardData.find(u => u.isCurrentUser) || {
    rank: currentUser?.rank || "-",
    score: currentUser?.score || 0
  }

  if (!mounted || !isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground mb-2">Global Leaderboard</h1>
          <p className="text-muted-foreground">Compete with quiz enthusiasts around the world</p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mx-auto mb-4 ">
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
                <p className="text-center text-4xl font-bold text-primary">{userStats.score.toLocaleString()}</p>
                <p className="text-center text-xs text-muted-foreground mt-2">Cumulative score</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-card/50">
            <CardContent className="pt-4">
              <div className="text-center">
                <p className="text-center text-muted-foreground text-sm mb-2">Total Quizzes</p>
                <p className="text-center text-4xl font-bold text-primary">{currentUser?.completedQuizzes || 0}</p>
                <p className="text-center text-xs text-muted-foreground mt-2">Finished assessments</p>
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
                  ? "bg-primary text-white"
                  : "border-border/50 bg-transparent bg-accent/9"
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
          <Button className="bg-primary text-white transition-all duration-300">
          <Link href="/dashboard">Take a Quiz to Earn Points</Link>
          </Button>
        </div>
      </main>
    </div>
  )
}
