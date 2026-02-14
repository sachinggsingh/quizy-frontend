import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAppSelector } from "@/lib/hooks"
import { useLeaderboardWs } from "./useLeaderboardWs"

export type Timeframe = "weekly" | "monthly" | "all-time"

export interface UseLeaderboardReturn {
  timeframe: Timeframe
  setTimeframe: (timeframe: Timeframe) => void
  leaderboardData: any[]
  userStats: { rank: number; score: number }
  currentUser: any
  isAuthenticated: boolean
  authCheckDone: boolean
  mounted: boolean
}

export function useLeaderboard(): UseLeaderboardReturn {
  const [timeframe, setTimeframe] = useState<Timeframe>("all-time")
  const [mounted, setMounted] = useState(false)
  const { isAuthenticated, authCheckDone } = useAppSelector((state) => state.auth)
  const { leaderboardData, userStats, currentUser } = useLeaderboardWs()
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Only redirect after we've tried to restore session from cookies (authCheckDone)
  useEffect(() => {
    if (mounted && authCheckDone && !isAuthenticated) {
      router.push("/sign-in")
    }
  }, [mounted, authCheckDone, isAuthenticated, router])

  return {
    timeframe,
    setTimeframe,
    leaderboardData,
    userStats,
    currentUser,
    isAuthenticated,
    authCheckDone,
    mounted,
  }
}
