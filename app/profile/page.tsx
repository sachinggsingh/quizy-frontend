"use client"

import { useEffect } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { ProfileHeader } from "@/components/profile-header"
import { ProfileStats } from "@/components/profile-stats"
import { AchievementCard } from "@/components/achievement-card"
import { ActivityFeed } from "@/components/activity-feed"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { fetchProfile } from "@/lib/features/auth/authSlice"
import { StreakDisplay } from "@/components/streak-display"

export default function ProfilePage() {
  const dispatch = useAppDispatch()
  const { user, isLoading, error } = useAppSelector((state) => state.auth)

  useEffect(() => {
    dispatch(fetchProfile())
  }, [dispatch])

  const achievements = [
    {
      title: "First Steps",
      description: "Complete your first quiz",
      icon: "🎯",
      achieved: (user?.completedQuizzes || 0) > 0,
      unlockedDate: user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : "Jan 5",
    },
    { 
      title: "Perfect Score", 
      description: "Score 100% on a quiz", 
      icon: "💯", 
      achieved: (user?.averageScore || 0) === 100, 
      unlockedDate: user?.updatedAt ? new Date(user.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : "Jan 12" 
    },
    { title: "Quiz Master", description: "Complete 25 quizzes", icon: "🏆", achieved: (user?.completedQuizzes || 0) >= 25 },
    {
      title: "Speedrunner",
      description: "Complete a quiz in under 5 min",
      icon: "⚡",
      achieved: true,
      unlockedDate: "Jan 18",
    },
    { title: "Consistency", description: "Maintain 30-day streak", icon: "📈", achieved: (user?.streak || 0) >= 30 },
    { title: "Top 10", description: "Reach top 10 leaderboard", icon: "👑", achieved: (user?.rank || 0) <= 10 && user?.rank > 0 },
  ]

  // Create real activity feed data from user profile
  const getDisplayActivities = () => {
    if (!user) return []

    // 1. Start with the explicit activity log if available
    const log = user.activityLog || []
    
    // 2. If log is empty but we have completed quizzes, add generic entries for them
    // This handles historical data provided in the user's DB snapshot
    if (log.length === 0 && user.completedQuizIds?.length > 0) {
      return user.completedQuizIds.map((id: string, index: number) => ({
        id: `hist-${id}-${index}`,
        type: "completed",
        quizTitle: "Quiz Completed",
        score: user.averageScore, // Use average score as a fallback
        date: user.updatedAt || user.createdAt || new Date().toISOString()
      }))
    }

    return log
  }

  const displayActivities = getDisplayActivities()

  if (isLoading && !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <p className="text-xl text-muted-foreground animate-pulse">Loading Profile...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 bg-destructive/10 border border-destructive/20 text-destructive p-4 rounded-lg">
            {error}
          </div>
        )}

        {/* Profile Header */}
        <section className="mb-8">
          <ProfileHeader user={user} />
        </section>

        {/* Stats Grid */}
        <section className="mb-8">
          <ProfileStats user={user} />
        </section>

        {/* Streak Display */}
        <section className="mb-8">
          <StreakDisplay user={user} />
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Achievements Section */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary to-accent mb-4">
                Achievements
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {achievements.map((achievement, index) => (
                  <AchievementCard key={index} {...achievement} />
                ))}
              </div>
            </div>
          </div>

          {/* Activity Feed Sidebar */}
          <div className="lg:col-span-1">
            <ActivityFeed activities={displayActivities} />
          </div>
        </div>

        {/* Preferences Section */}
        {/* <section className="mt-8">
          <Card className="border-primary/20 bg-gradient-to-br from-card/80 to-card/40">
            <CardHeader>
              <CardTitle>Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-card/30 border border-border/20">
                <label className="text-sm font-medium">Email Notifications</label>
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded cursor-pointer" />
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-card/30 border border-border/20">
                <label className="text-sm font-medium">Public Profile</label>
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded cursor-pointer" />
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-card/30 border border-border/20">
                <label className="text-sm font-medium">Show Statistics</label>
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded cursor-pointer" />
              </div>
            </CardContent>
          </Card>
        </section> */}
      </main>
    </div>
  )
}
