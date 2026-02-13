"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { AnswerOption } from "@/components/answer-option"
import type { Question } from "@/lib/features/quiz/quizSlice"

interface OptionsListProps {
  question: Question
  selectedAnswer: string | undefined
  isSubmitted: boolean
  onSelect: (optionIndex: string) => void
}

export function OptionsList({ question, selectedAnswer, isSubmitted, onSelect }: OptionsListProps) {
  if (!question.options || !Array.isArray(question.options) || question.options.length === 0) {
    return (
      <Card className="p-4 border-yellow-500/30 bg-yellow-500/5">
        <p className="text-yellow-600 dark:text-yellow-400 font-semibold mb-2">
          No options available for this question
        </p>
        {process.env.NODE_ENV === 'development' && (
          <div className="text-xs text-muted-foreground space-y-1">
            <p>Question ID: {question.id}</p>
            <p>Has options: {question.options ? 'Yes' : 'No'}</p>
            <p>Is Array: {Array.isArray(question.options) ? 'Yes' : 'No'}</p>
            <p>Options length: {question.options?.length || 0}</p>
            <p>Options data: {JSON.stringify(question.options)}</p>
          </div>
        )}
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {question.options.map((option: string, index: number) => {
        const optionText = typeof option === 'string' ? option : String(option || `Option ${index + 1}`)
        return (
          <motion.div
            key={`option-${question.id}-${index}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 + 0.2 }}
          >
            <AnswerOption
              id={index.toString()}
              text={optionText}
              isSelected={selectedAnswer === index.toString()}
              isCorrect={index === question.answer}
              isSubmitted={isSubmitted}
              onSelect={onSelect}
            />
          </motion.div>
        )
      })}
    </div>
  )
}
