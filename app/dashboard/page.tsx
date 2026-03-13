"use client"

import { Suspense, useState } from "react"
import { useDashboardData } from "@/lib/hooks/useDashboardData"
import { LoaderThree, LoaderFive } from "@/components/ui/loader"
import {
  DashboardHeader,
  DashboardStats,
  DashboardCategories,
} from "@/components/dashboard"
import { CreateRoomCard } from "@/components/rooms/create-room-card"

function DashboardContent() {
  const {
    completedQuizzes,
    averageScore,
    rank,
    categorizedQuizzes,
    effectivelyLoading,
    filteredQuizzes,
    error,
    isSubscribed,
  } = useDashboardData()

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-8">
          <div className="flex-1">
            <DashboardHeader />
          </div>
          {isSubscribed && (
            <div className="w-full md:w-80 flex-shrink-0">
              <CreateRoomCard />
            </div>
          )}
        </div>

        <DashboardStats
          totalQuizzes={filteredQuizzes.length || 0}
          completedQuizzes={completedQuizzes}
          averageScore={averageScore}
          rank={rank}
        />

        <DashboardCategories
          categorizedQuizzes={categorizedQuizzes}
          effectivelyLoading={effectivelyLoading}
          error={error}
        />
      </main>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 gap-6">
        <LoaderThree />
        <LoaderFive text="Preparing Dashboard..." />
      </div>
    }>
      <DashboardContent />
    </Suspense>
  )
}
