"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface QuizErrorProps {
  error?: string | null
}

export function QuizError({ error }: QuizErrorProps) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="p-8 text-center space-y-4 max-w-md">
        <h2 className="text-2xl font-bold text-red-500">Error</h2>
        <p className="text-muted-foreground">{error || "Quiz not found"}</p>
        <Button asChild>
          <Link href="/quiz">Back to Quizzes</Link>
        </Button>
      </Card>
    </div>
  )
}
