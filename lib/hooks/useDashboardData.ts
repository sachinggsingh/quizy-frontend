"use client"

import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { fetchQuizzes } from "@/lib/features/quiz/quizSlice"
import { fetchProfile } from "@/lib/features/auth/authSlice"
import { getSubscription } from "@/lib/api/subscription"

const MIN_LOADER_MS = 1500

export function useDashboardData() {
  const dispatch = useAppDispatch()
  const { quizzes, isLoading, error } = useAppSelector((state) => state.quiz)
  const { user, isAuthenticated } = useAppSelector((state) => state.auth)

  const [showMinLoader, setShowMinLoader] = useState(true)
  const [globalRank, setGlobalRank] = useState<number | string>("-")
  const [subscription, setSubscription] = useState<{ status?: string; plan?: string } | null>(null)
  const [subscriptionLoaded, setSubscriptionLoaded] = useState(false)
  const [filter, setFilter] = useState<"new" | "attempted">("new")

  useEffect(() => {
    dispatch(fetchQuizzes())
    dispatch(fetchProfile())
    getSubscription()
      .then((sub) => {
        setSubscription(sub ?? null)
        setSubscriptionLoaded(true)
      })
      .catch(() => {
        setSubscription(null)
        setSubscriptionLoaded(true)
      })
    const timer = setTimeout(() => setShowMinLoader(false), MIN_LOADER_MS)
    return () => clearTimeout(timer)
  }, [dispatch])

  useEffect(() => {
    if (!isAuthenticated || !user?.id) return

    let socket: WebSocket | null = null
    let reconnectTimeout: ReturnType<typeof setTimeout>
    let isMounted = true

    const calculateRank = (users: { id?: string; score?: number }[]) => {
      if (users.length === 0) return
      const userIndex = users.findIndex((u) => u.id === user?.id)
      if (userIndex !== -1) {
        setGlobalRank(userIndex + 1)
      } else {
        const usersWithHigherScore = users.filter((u) => (u?.score ?? 0) > (user?.score ?? 0))
        const minRank = usersWithHigherScore.length + 1
        const lastScore = users[users.length - 1]?.score
        if (users.length > 0 && user?.score !== undefined && lastScore !== undefined && user.score < lastScore) {
          setGlobalRank(`>${users.length}`)
        } else {
          setGlobalRank(minRank)
        }
      }
    }

    const connect = () => {
      if (!isMounted) return
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080"
      const cleanBackendUrl = backendUrl.replace(/\/$/, "")
      const wsProtocol = cleanBackendUrl.startsWith("https") ? "wss" : "ws"
      const wsBaseUrl = cleanBackendUrl.replace(/^https?:\/\//, "")
      const wsUrl = `${wsProtocol}://${wsBaseUrl}/ws/leaderboard`

      try {
        const ws = new WebSocket(wsUrl)
        socket = ws
        ws.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data as string)
            const users = (message.type === "LEADERBOARD_UPDATE" && Array.isArray(message.data)
              ? message.data
              : Array.isArray(message)
                ? message
                : []) as { id?: string; score?: number }[]
            if (users.length > 0) calculateRank(users)
          } catch {
            // ignore parse errors
          }
        }
        ws.onclose = (event) => {
          if (isMounted && event.code !== 1000 && event.code !== 1001) {
            reconnectTimeout = setTimeout(connect, 3000)
          }
        }
      } catch {
        if (isMounted) reconnectTimeout = setTimeout(connect, 5000)
      }
    }

    if (typeof window !== "undefined") connect()

    return () => {
      isMounted = false
      clearTimeout(reconnectTimeout)
      if (socket && (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING)) {
        try {
          socket.close(1000, "Component unmounting")
        } catch {
          // ignore
        }
      }
    }
  }, [isAuthenticated, user?.id, user?.score])

  const completedQuizzes = user?.completedQuizzes ?? 0
  const averageScore = user?.averageScore ?? 0
  const filteredQuizzes = quizzes.filter((q) => (filter === "attempted" ? q.attempted : !q.attempted))
  const effectivelyLoading = isLoading || showMinLoader

  const status = subscription?.status != null ? String(subscription.status).toLowerCase() : ""
  const planRaw = subscription?.plan != null ? String(subscription.plan).toLowerCase() : ""
  const isSubscribed =
    !!subscription &&
    (status === "active" || planRaw === "pro" || planRaw === "enterprise")
  const planType = planRaw === "enterprise" ? "enterprise" : planRaw === "pro" ? "pro" : "free"

  return {
    quizzes,
    user,
    completedQuizzes,
    averageScore,
    rank: globalRank,
    subscription,
    subscriptionLoaded,
    isSubscribed,
    planType,
    planRaw,
    filter,
    setFilter,
    filteredQuizzes,
    effectivelyLoading,
    isLoading,
    error,
  }
}
