"use client"

import { StatsCard } from "@/components/stats-card"

interface DashboardStatsProps {
  totalQuizzes: number
  completedQuizzes: number
  averageScore: number
  rank: number | string
}

export function DashboardStats({
  totalQuizzes,
  completedQuizzes,
  averageScore,
  rank,
}: DashboardStatsProps) {
  const completionPercentage = totalQuizzes > 0 
    ? Math.round((completedQuizzes / totalQuizzes) * 100) 
    : 0

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <StatsCard 
        label="Total Quizzes" 
        value={totalQuizzes} 
        subtext="Available quizzes" 
      />
      <StatsCard
        label="Completed"
        value={completedQuizzes}
        subtext={`${completionPercentage}% progress`}
      />
      <StatsCard 
        label="Average Score" 
        value={`${Math.round(averageScore)}%`} 
        subtext="Across completed quizzes" 
      />
      <StatsCard 
        label="Global Rank" 
        value={`#${rank}`} 
        subtext="Your position globally" 
      />
    </div>
  )
}
