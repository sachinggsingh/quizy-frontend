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
  mounted: boolean
}

export function useLeaderboard(): UseLeaderboardReturn {
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

  return {
    timeframe,
    setTimeframe,
    leaderboardData,
    userStats,
    currentUser,
    isAuthenticated,
    mounted,
  }
}
