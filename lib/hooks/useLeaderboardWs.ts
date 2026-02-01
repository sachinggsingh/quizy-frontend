"use client"

import { useEffect, useState } from "react"
import { useAppSelector } from "@/lib/hooks"

export type LeaderboardRow = {
  rank: number
  name: string
  avatar: string
  score: number
  quizzesCompleted: number
  averageScore: number
  isCurrentUser: boolean
}

function buildWsUrl(): string {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080"
  const clean = backendUrl.replace(/\/$/, "")
  const protocol = clean.startsWith("https") ? "wss" : "ws"
  const base = clean.replace(/^https?:\/\//, "")
  return `${protocol}://${base}/ws/leaderboard`
}

export function useLeaderboardWs() {
  const { user: currentUser, isAuthenticated } = useAppSelector((state) => state.auth)
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardRow[]>([])

  useEffect(() => {
    if (!isAuthenticated) return

    let socket: WebSocket | null = null
    let reconnectTimeout: ReturnType<typeof setTimeout>
    let isMounted = true

    const connect = () => {
      if (!isMounted) return
      try {
        const ws = new WebSocket(buildWsUrl())
        socket = ws
        ws.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data as string)
            const users: any[] =
              message.type === "LEADERBOARD_UPDATE" && Array.isArray(message.data)
                ? message.data
                : Array.isArray(message)
                  ? message
                  : []
            if (users.length > 0) {
              const mapped: LeaderboardRow[] = users.map((u: any, index: number) => ({
                rank: index + 1,
                name: u.name ?? "?",
                avatar: (u.name ?? "?")
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2) || "?",
                score: u.score ?? 0,
                quizzesCompleted: u.completed_quizzes ?? u.completedQuizzes ?? 0,
                averageScore: Math.round(u.average_score ?? u.averageScore ?? 0),
                isCurrentUser: u.id === currentUser?.id,
              }))
              setLeaderboardData(mapped)
            }
          } catch {
            // ignore
          }
        }
        ws.onclose = (event) => {
          if (isMounted && event.code !== 1000 && event.code !== 1001) {
            reconnectTimeout = setTimeout(connect, 3000)
          }
        }
      } catch {
        if (isMounted) reconnectTimeout = setTimeout(connect, 3000)
      }
    }

    connect()
    return () => {
      isMounted = false
      clearTimeout(reconnectTimeout)
      if (socket) {
        try {
          socket.close(1000, "Component unmounting")
        } catch {
          // ignore
        }
      }
    }
  }, [isAuthenticated, currentUser?.id])

  const userStats = leaderboardData.find((u) => u.isCurrentUser) ?? {
    rank: (currentUser as any)?.rank ?? "-",
    score: (currentUser as any)?.score ?? 0,
  }

  return { leaderboardData, userStats, currentUser }
}
