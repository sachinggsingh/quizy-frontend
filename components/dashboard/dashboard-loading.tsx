"use client"

import { LoaderThree, LoaderFive } from "@/components/ui/loader"

export function DashboardLoading() {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <LoaderThree />
      <LoaderFive text="Loading Categories..." />
    </div>
  )
}
