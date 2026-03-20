"use client"

import { Suspense } from "react"
import { useDashboardData } from "@/lib/hooks/useDashboardData"
import { LoaderThree, LoaderFive } from "@/components/ui/loader"
import { CreateRoomCard } from "@/components/rooms/create-room-card"
import { JoinRoomCard } from "@/components/rooms/join-room-card"

function RoomContent() {
  const { isSubscribed, effectivelyLoading } = useDashboardData()

  if (effectivelyLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4 gap-6">
        <LoaderThree />
        <LoaderFive text="Loading Room details..." />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h1 className="text-5xl font-black tracking-tight">Live Rooms</h1>
            <p className="text-muted-foreground text-xl max-w-2xl mx-auto">
              Manage your live sessions. Create a new room or join an existing one to compete in real-time.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            <div className="bg-card rounded-2xl border border-border/50 shadow-2xl overflow-hidden flex flex-col">
              <CreateRoomCard />
            </div>
            <div className="bg-card rounded-2xl border border-border/50 shadow-2xl overflow-hidden flex flex-col">
              <JoinRoomCard />
            </div>
          </div>
          
          {!isSubscribed && (
            <div className="text-center p-8 bg-primary/5 rounded-2xl border border-primary/20 backdrop-blur-sm">
              <p className="text-lg text-primary font-semibold">
                Want to host your own rooms? 
                <a href="/subscription" className="ml-2 underline hover:text-primary/80 transition-colors">
                  Upgrade to Pro
                </a>
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default function RoomPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 gap-6">
        <LoaderThree />
        <LoaderFive text="Preparing Room..." />
      </div>
    }>
      <RoomContent />
    </Suspense>
  )
}
