"use client"
import { BarChart3, Trophy, Zap, Target } from "lucide-react"
import { StatsCard } from "./stats-card"

interface ProfileStatsProps {
  user: any
}

export function ProfileStats({ user }: ProfileStatsProps) {
  const stats = [
    {
      label: "Total Quizzes",
      value: user?.completedQuizzes || "0",
      subtext: "Completed",
      icon: <Target className="w-5 h-5" />,
    },
    {
      label: "Total Points",
      value: user?.score?.toLocaleString() || "0",
      subtext: "Cumulative",
      icon: <Zap className="w-5 h-5 text-yellow-500" />,
    },
    {
      label: "Average Score",
      value: `${Math.round(user?.averageScore || 0)}%`,
      subtext: "Performance",
      icon: <BarChart3 className="w-5 h-5" />,
    },
    {
      label: "Global Rank",
      value: user?.rank ? `#${user.rank}` : "-",
      subtext: "Out of users",
      icon: <Trophy className="w-5 h-5" />,
    },
    {
      label: "Current Streak",
      value: user?.streak || "0",
      subtext: "Days active",
      icon: <Zap className="w-5 h-5" />,
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <StatsCard key={index} {...stat} />
      ))}
    </div>
  )
}
