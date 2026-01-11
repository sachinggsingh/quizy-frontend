"use client"

import { Button } from "@/components/ui/button"

interface QuizControlsProps {
  onPrevious: () => void
  onNext: () => void
  onSubmit: () => void
  canGoPrevious: boolean
  canGoNext: boolean
  hasAnswered: boolean
  isSubmitted: boolean
  isLastQuestion: boolean
}

export function QuizControls({
  onPrevious,
  onNext,
  onSubmit,
  canGoPrevious,
  canGoNext,
  hasAnswered,
  isSubmitted,
  isLastQuestion,
}: QuizControlsProps) {
  return (
    <div className="flex items-center justify-between gap-3">
      <Button
        onClick={onPrevious}
        disabled={!canGoPrevious}
        variant="outline"
        className="border-border/50 hover:border-primary/50 hover:bg-primary/10 bg-transparent"
      >
        ← Previous
      </Button>

      {!isSubmitted && (
        <Button
          onClick={onSubmit}
          disabled={!hasAnswered}
          className="bg-gradient-to-r from-primary to-accent hover:shadow-lg hover:shadow-primary/50 text-primary-foreground"
        >
          Submit Answer
        </Button>
      )}

      {isSubmitted && (
        <Button
          onClick={onNext}
          disabled={!canGoNext}
          className={`${
            isLastQuestion
              ? "bg-gradient-to-r from-green-500 to-green-600 hover:shadow-lg hover:shadow-green-500/50"
              : "bg-gradient-to-r from-primary to-accent hover:shadow-lg hover:shadow-primary/50"
          } text-primary-foreground`}
        >
          {isLastQuestion ? "Finish Quiz" : "Next →"}
        </Button>
      )}
    </div>
  )
}
