"use client"

interface QuizCatalogErrorProps {
  error: string
}

export function QuizCatalogError({ error }: QuizCatalogErrorProps) {
  return (
    <div className="text-destructive text-center py-12 bg-destructive/10 rounded-2xl border border-destructive/20 shadow-inner max-w-2xl mx-auto">
      <p className="font-bold mb-2">Something went wrong</p>
      <p className="text-sm opacity-80">{error}</p>
    </div>
  )
}
