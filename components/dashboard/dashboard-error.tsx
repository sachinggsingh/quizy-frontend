"use client"

interface DashboardErrorProps {
  error: string
}

export function DashboardError({ error }: DashboardErrorProps) {
  return (
    <div className="text-destructive text-center py-12 bg-destructive/10 rounded-2xl border border-destructive/20 max-w-2xl mx-auto">
      {error}
    </div>
  )
}
