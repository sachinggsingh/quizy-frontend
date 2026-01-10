
"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface LeaderboardUser {
  rank: number
  name: string
  avatar: string
  score: number
  quizzesCompleted: number
  averageScore: number
  isCurrentUser?: boolean
}

interface LeaderboardTableProps {
  data: LeaderboardUser[]
  timeframe: "weekly" | "monthly" | "all-time"
}

export function LeaderboardTable({ data, timeframe }: LeaderboardTableProps) {
  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Top Performers</span>
          <span className="text-sm font-normal text-muted-foreground capitalize">{timeframe}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/50 text-left text-sm font-semibold text-muted-foreground">
                <th className="pb-3 pr-4">Rank</th>
                <th className="pb-3 pr-4">User</th>
                <th className="pb-3 pr-4 text-right">Points</th>
                <th className="pb-3 pr-4 text-right">Quizzes</th>
                <th className="pb-3 text-right">Avg Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {data.map((user) => (
                <tr
                  key={user.rank}
                  className={`hover:bg-accent/5 transition-colors ${user.isCurrentUser ? "bg-primary/10" : ""}`}
                >
                  <td className="py-4 pr-4">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${
                          user.rank === 1
                            ? "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400"
                            : user.rank === 2
                              ? "bg-slate-400/20 text-slate-700 dark:text-slate-400"
                              : user.rank === 3
                                ? "bg-orange-600/20 text-orange-700 dark:text-orange-400"
                                : "bg-primary/10 text-primary"
                        }`}
                      >
                        {user.rank}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 pr-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-bold">
                        {user.avatar}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{user.name}</p>
                        {user.isCurrentUser && <span className="text-xs text-primary font-medium">You</span>}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 pr-4 text-right">
                    <span className="font-bold text-lg text-primary">{user.score.toLocaleString()}</span>
                  </td>
                  <td className="py-4 pr-4 text-right text-foreground">{user.quizzesCompleted}</td>
                  <td className="py-4 text-right font-semibold text-foreground">{user.averageScore}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
