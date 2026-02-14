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
              const mapped: LeaderboardRow[] = users.map((u: any, index: number) => {
                const score = Number(u.score ?? u.points ?? u.total_score ?? 0)
                const quizIds = u.completed_quiz_ids ?? u.completedQuizIds
                const quizzesCompleted = typeof u.completed_quizzes === "number" ? u.completed_quizzes : (Array.isArray(quizIds) ? quizIds.length : 0)
                return {
                  rank: index + 1,
                  name: String(u.name ?? "?"),
                  avatar: (String(u.name ?? "?"))
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2) || "?",
                  score: Number.isFinite(score) ? score : 0,
                  quizzesCompleted: Number.isFinite(quizzesCompleted) ? quizzesCompleted : 0,
                  averageScore: Math.round(Number(u.average_score ?? u.averageScore ?? 0) || 0),
                  isCurrentUser: String(u.id ?? u._id ?? "") === String(currentUser?.id ?? ""),
                }
              })
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
    score: Number((currentUser as any)?.score ?? (currentUser as any)?.total_score ?? 0) || 0,
    quizzesCompleted: (currentUser as any)?.completedQuizzes ?? 0,
    averageScore: Math.round(Number((currentUser as any)?.averageScore ?? (currentUser as any)?.average_score ?? 0) || 0),
  }

  return { leaderboardData, userStats, currentUser }
}
