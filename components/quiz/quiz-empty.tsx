"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface QuizEmptyProps {
  quizId?: string
  quizTitle?: string
  questions?: any[]
}

export function QuizEmpty({ quizId, quizTitle, questions }: QuizEmptyProps) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="p-8 text-center space-y-4 max-w-md">
        <h2 className="text-2xl font-bold text-red-500">No Questions Found</h2>
        <p className="text-muted-foreground">
          This quiz doesn't seem to have any questions. Please try another one.
        </p>
        {process.env.NODE_ENV === 'development' && (
          <div className="text-xs text-muted-foreground mt-4 p-4 bg-muted rounded">
            <p>Debug Info:</p>
            <p>Quiz ID: {quizId}</p>
            <p>Quiz Title: {quizTitle}</p>
            <p>Questions Array: {JSON.stringify(questions)}</p>
          </div>
        )}
        <Button asChild>
          <Link href="/quiz">Back to Quizzes</Link>
        </Button>
      </Card>
    </div>
  )
}
