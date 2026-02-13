"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import { QuestionDisplay } from "@/components/question-display"
import { QuizControls } from "@/components/quiz-controls"
import { OptionsList } from "./options-list"
import { AnswerFeedback } from "./answer-feedback"
import type { Question } from "@/lib/features/quiz/quizSlice"

interface QuizQuestionSectionProps {
  quizTitle: string
  difficulty?: string
  currentQuestion: Question | null
  currentQuestionIndex: number
  totalQuestions: number
  selectedAnswer: string | undefined
  isSubmitted: boolean
  hasAnswered: boolean
  isLastQuestion: boolean
  onSelectAnswer: (optionIndex: string) => void
  onSubmitAnswer: () => void
  onNextQuestion: () => void
  onPreviousQuestion: () => void
}

export function QuizQuestionSection({
  quizTitle,
  difficulty,
  currentQuestion,
  currentQuestionIndex,
  totalQuestions,
  selectedAnswer,
  isSubmitted,
  hasAnswered,
  isLastQuestion,
  onSelectAnswer,
  onSubmitAnswer,
  onNextQuestion,
  onPreviousQuestion,
}: QuizQuestionSectionProps) {
  if (!currentQuestion) {
    return (
      <Card className="p-8 text-center space-y-4">
        <p className="text-muted-foreground font-semibold">Question not found</p>
        <p className="text-xs text-muted-foreground">
          Index: {currentQuestionIndex}, Total: {totalQuestions}
        </p>
      </Card>
    )
  }

  const isCorrect = selectedAnswer === currentQuestion.answer.toString()
  // Use question text, with fallback to question ID or placeholder
  const questionText = currentQuestion.text && currentQuestion.text.trim() 
    ? currentQuestion.text 
    : currentQuestion.id
      ? `Question ${currentQuestion.id.slice(-4)}: Select the correct answer`
      : `Select the correct answer for question ${currentQuestionIndex + 1}`

  return (
    <div className="lg:col-span-2 space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          {quizTitle}
        </h1>
        <p className="text-muted-foreground">Answer the question below to proceed.</p>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestionIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="space-y-8"
        >
          {/* Debug info (development only) */}
            {/* {process.env.NODE_ENV === 'development' && (
              <div className="text-xs text-muted-foreground p-2 bg-muted rounded mb-2">
                Debug: Question {currentQuestionIndex + 1} | Options: {currentQuestion.options?.length || 0} | 
                Has Options: {currentQuestion.options && Array.isArray(currentQuestion.options) ? 'Yes' : 'No'}
              </div>
            )} */}

          <QuestionDisplay
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={totalQuestions}
            question={questionText}
            category={difficulty}
          />

          <OptionsList
            question={currentQuestion}
            selectedAnswer={selectedAnswer}
            isSubmitted={isSubmitted}
            onSelect={onSelectAnswer}
          />

          {isSubmitted && (
            <AnswerFeedback isCorrect={isCorrect} />
          )}
        </motion.div>
      </AnimatePresence>

      <div className="pt-4">
        <QuizControls
          onPrevious={onPreviousQuestion}
          onNext={onNextQuestion}
          onSubmit={onSubmitAnswer}
          canGoPrevious={currentQuestionIndex > 0}
          canGoNext={isSubmitted}
          hasAnswered={hasAnswered}
          isSubmitted={isSubmitted}
          isLastQuestion={isLastQuestion}
        />
      </div>
    </div>
  )
}
