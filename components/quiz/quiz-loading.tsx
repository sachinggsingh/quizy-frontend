"use client"

import { LoaderThree, LoaderFive } from "@/components/ui/loader"

export function QuizLoading() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 gap-6">
      <LoaderThree />
      <LoaderFive text="Preparing Quiz..." />
    </div>
  )
}
