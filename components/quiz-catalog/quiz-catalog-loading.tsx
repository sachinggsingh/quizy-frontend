"use client"

import { LoaderThree, LoaderFive } from "@/components/ui/loader"

export function QuizCatalogLoading() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 gap-6">
      <LoaderThree />
      <LoaderFive text="Loading Quiz Catalog..." />
    </div>
  )
}
