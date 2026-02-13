"use client"

import { Card, CardContent } from "@/components/ui/card"

interface LeaderboardStatsProps {
  rank: number
  score: number
  completedQuizzes: number
}

export function LeaderboardStats({ rank, score, completedQuizzes }: LeaderboardStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mx-auto mb-4">
      <Card className="border-primary/20 bg-card/50">
        <CardContent className="pt-4">
          <div className="text-center">
            <p className="text-center text-muted-foreground text-sm mb-2">Your Rank</p>
            <p className="text-center text-4xl font-bold text-primary">#{rank}</p>
            <p className="text-center text-xs text-muted-foreground mt-2">Global rating</p>
          </div>
        </CardContent>
      </Card>
      <Card className="border-primary/20 bg-card/50">
        <CardContent className="pt-4">
          <div className="text-center">
            <p className="text-center text-muted-foreground text-sm mb-2">Your Points</p>
            <p className="text-center text-4xl font-bold text-primary">
              {Number(score).toLocaleString()}
            </p>
            <p className="text-center text-xs text-muted-foreground mt-2">Cumulative score</p>
          </div>
        </CardContent>
      </Card>
      <Card className="border-primary/20 bg-card/50">
        <CardContent className="pt-4">
          <div className="text-center">
            <p className="text-center text-muted-foreground text-sm mb-2">Total Quizzes</p>
            <p className="text-center text-4xl font-bold text-primary">
              {completedQuizzes ?? 0}
            </p>
            <p className="text-center text-xs text-muted-foreground mt-2">Finished assessments</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
