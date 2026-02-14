"use client"

import { useLeaderboard } from "@/lib/hooks/useLeaderboard"
import { LeaderboardTable } from "@/components/leaderboard-table"
import {
  LeaderboardHeader,
  LeaderboardStats,
  LeaderboardFilters,
  LeaderboardFooter,
} from "@/components/leaderboard"

export default function LeaderboardPage() {
  const {
    timeframe,
    setTimeframe,
    leaderboardData,
    userStats,
    currentUser,
    mounted,
    isAuthenticated,
    authCheckDone,
  } = useLeaderboard()

  if (!mounted || !authCheckDone) {
    return null
  }
  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <LeaderboardHeader />

        <LeaderboardStats
          rank={userStats.rank}
          score={userStats.score}
          completedQuizzes={currentUser?.completedQuizzes ?? 0}
        />

        <LeaderboardFilters timeframe={timeframe} onTimeframeChange={setTimeframe} />

        <LeaderboardTable data={leaderboardData} timeframe={timeframe} />

        <LeaderboardFooter />
      </main>
    </div>
  )
}
