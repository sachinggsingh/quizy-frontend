"use client"

import { Card, CardHeader, CardTitle } from "@/components/ui/card"

interface QuestionDisplayProps {
  questionNumber: number
  totalQuestions: number
  question: string
  category?: string
}

export function QuestionDisplay({ questionNumber, totalQuestions, question, category }: QuestionDisplayProps) {
  return (
    <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-4">
        {category && (
          <div className="mb-2">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-primary/20 text-primary">
              {category}
            </span>
          </div>
        )}
        <CardTitle className="text-2xl leading-relaxed text-balance bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
          {question}
        </CardTitle>
      </CardHeader>
    </Card>
  )
}
