"use client"

import { useParams } from "next/navigation"
import { useQuiz } from "@/lib/hooks/useQuiz"
import { QuizLoading } from "@/components/quiz/quiz-loading"
import { QuizError } from "@/components/quiz/quiz-error"
import { QuizEmpty } from "@/components/quiz/quiz-empty"
import { QuizContainer } from "@/components/quiz/quiz-container"

export default function QuizPage() {
  const params = useParams()
  const id = params.id as string
  
  const quiz = useQuiz(id)
  const { isLoading, error, currentQuiz, showMinLoader } = quiz

  // Loading state
  if ((isLoading || showMinLoader) || (!currentQuiz && !error)) {
    return <QuizLoading />
  }

  // Error state
  if (error || !currentQuiz) {
    return <QuizError error={error} />
  }

  // Empty questions state
  if (!currentQuiz.questions || currentQuiz.questions.length === 0) {
    return (
      <QuizEmpty
        quizId={currentQuiz.id}
        quizTitle={currentQuiz.title}
        questions={currentQuiz.questions}
      />
    )
  }

  // Main quiz content
  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden no-scrollbar">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/20 rounded-full blur-[120px]" />
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <QuizContainer quiz={quiz} />
      </main>
    </div>
  )
}
