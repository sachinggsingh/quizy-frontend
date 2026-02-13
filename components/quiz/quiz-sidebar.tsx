"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Timer } from "lucide-react"
import { QuizProgress } from "@/components/quiz-progress"

interface QuizSidebarProps {
  currentQuestion: number
  totalQuestions: number
  timeRemaining: number
  maxTime: number
  pointsPerQuestion: number
}

export function QuizSidebar({
  currentQuestion,
  totalQuestions,
  timeRemaining,
  maxTime,
  pointsPerQuestion,
}: QuizSidebarProps) {
  return (
    <div className="lg:col-span-1 space-y-6">
      <Card className="p-6 border-primary/20 bg-card/80 backdrop-blur-sm sticky top-24">
        <h3 className="text-sm font-semibold text-muted-foreground mb-6 flex items-center gap-2">
          <Timer className="w-4 h-4" />
          TIME REMAINING
        </h3>
        <QuizProgress
          current={currentQuestion}
          total={totalQuestions}
          timeRemaining={timeRemaining}
          maxTime={maxTime}
        />
        <div className="mt-8 pt-6 border-t border-border/50">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-muted-foreground">Point Value</span>
            <span className="text-sm font-bold">{pointsPerQuestion} pts</span>
          </div>
          <Button asChild variant="outline" className="w-full text-red-500 border-red-500/20 hover:bg-red-500/5">
            <Link href="/quiz">Exit Quiz</Link>
          </Button>
        </div>
      </Card>
    </div>
  )
}
