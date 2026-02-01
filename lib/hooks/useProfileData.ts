"use client"

import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { fetchProfile } from "@/lib/features/auth/authSlice"

export type AchievementItem = {
  title: string
  description: string
  icon: string
  achieved: boolean
  unlockedDate?: string
}

export type ActivityItem = {
  id: string
  type: string
  quizTitle: string
  score?: number
  date: string
}

function deriveAchievements(user: any): AchievementItem[] {
  const completed = user?.completedQuizzes ?? 0
  const avg = user?.averageScore ?? 0
  const streak = user?.streak ?? 0
  const rank = user?.rank ?? 0
  const fmt = (d: string | undefined) =>
    d ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : undefined

  return [
    {
      title: "First Steps",
      description: "Complete your first quiz",
      icon: "🎯",
      achieved: completed > 0,
      unlockedDate: fmt(user?.createdAt) ?? "Jan 5",
    },
    {
      title: "Perfect Score",
      description: "Score 100% on a quiz",
      icon: "💯",
      achieved: avg === 100,
      unlockedDate: fmt(user?.updatedAt) ?? "Jan 12",
    },
    { title: "Quiz Master", description: "Complete 25 quizzes", icon: "🏆", achieved: completed >= 25 },
    {
      title: "Speedrunner",
      description: "Complete a quiz in under 5 min",
      icon: "⚡",
      achieved: false,
      unlockedDate: "Jan 18",
    },
    { title: "Consistency", description: "Maintain 30-day streak", icon: "📈", achieved: streak >= 30 },
    { title: "Top 10", description: "Reach top 10 leaderboard", icon: "👑", achieved: rank <= 10 && rank > 0 },
  ]
}

function deriveDisplayActivities(user: any): ActivityItem[] {
  if (!user) return []
  const log = (user.activityLog as ActivityItem[]) ?? []
  const ids = (user.completedQuizIds as string[]) ?? (user.completed_quiz_ids as string[]) ?? []
  if (log.length > 0) return log
  if (ids.length === 0) return []
  const fallbackDate = user.updatedAt ?? user.createdAt ?? new Date().toISOString()
  return ids.map((id, index) => ({
    id: `hist-${id}-${index}`,
    type: "completed",
    quizTitle: "Quiz Completed",
    score: user.averageScore,
    date: fallbackDate,
  }))
}

export function useProfileData() {
  const dispatch = useAppDispatch()
  const { user, isLoading, error } = useAppSelector((state) => state.auth)

  useEffect(() => {
    dispatch(fetchProfile())
  }, [dispatch])

  const achievements = deriveAchievements(user)
  const displayActivities = deriveDisplayActivities(user)

  return { user, isLoading, error, achievements, displayActivities }
}
