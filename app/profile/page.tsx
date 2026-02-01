"use client"

import { ProfileHeader } from "@/components/profile-header"
import { ProfileStats } from "@/components/profile-stats"
import { AchievementCard } from "@/components/achievement-card"
import { ActivityFeed } from "@/components/activity-feed"
import { StreakDisplay } from "@/components/streak-display"
import { useProfileData } from "@/lib/hooks/useProfileData"

export default function ProfilePage() {
  const { user, isLoading, error, achievements, displayActivities } = useProfileData()

  if (isLoading && !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <p className="text-xl text-muted-foreground animate-pulse">Loading Profile...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 bg-destructive/10 border border-destructive/20 text-destructive p-4 rounded-lg">
            {error}
          </div>
        )}

        <section className="mb-8">
          <ProfileHeader user={user} />
        </section>

        <section className="mb-8">
          <ProfileStats user={user} />
        </section>

        <section className="mb-8">
          <StreakDisplay user={user} />
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
          <div className="lg:col-span-1">
            <ActivityFeed activities={displayActivities} />
          </div>
        </div>
      </main>
    </div>
  )
}
