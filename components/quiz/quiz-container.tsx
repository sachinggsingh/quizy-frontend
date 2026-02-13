"use client"

import { QuizQuestionSection } from "./quiz-question-section"
import { QuizSidebar } from "./quiz-sidebar"
import { QuizCompletionScreen } from "./quiz-completion-screen"
import type { UseQuizReturn } from "@/lib/hooks/useQuiz"

interface QuizContainerProps {
  quiz: UseQuizReturn
}

export function QuizContainer({ quiz }: QuizContainerProps) {
  const {
    currentQuiz,
    currentQuestion,
    currentQuestionIndex,
    selectedAnswers,
    submittedAnswers,
    timeRemaining,
    quizCompleted,
    score,
    hasAnswered,
    isSubmitted,
    handleSelectAnswer,
    handleSubmitAnswer,
    handleNextQuestion,
    handlePreviousQuestion,
  } = quiz

  if (quizCompleted) {
    return (
      <QuizCompletionScreen
        quizTitle={currentQuiz.title}
        score={score}
        totalPoints={currentQuiz.points}
        totalQuestions={currentQuiz.questions.length}
        answeredCount={Object.keys(submittedAnswers).length}
      />
    )
  }

  const selectedAnswer = selectedAnswers[currentQuestionIndex.toString()]
  const pointsPerQuestion = Math.round(currentQuiz.points / currentQuiz.questions.length)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <QuizQuestionSection
        quizTitle={currentQuiz.title}
        difficulty={currentQuiz.difficulty}
        currentQuestion={currentQuestion}
        currentQuestionIndex={currentQuestionIndex}
        totalQuestions={currentQuiz.questions.length}
        selectedAnswer={selectedAnswer}
        isSubmitted={isSubmitted}
        hasAnswered={hasAnswered}
        isLastQuestion={currentQuestionIndex === currentQuiz.questions.length - 1}
        onSelectAnswer={handleSelectAnswer}
        onSubmitAnswer={handleSubmitAnswer}
        onNextQuestion={handleNextQuestion}
        onPreviousQuestion={handlePreviousQuestion}
      />

      <QuizSidebar
        currentQuestion={currentQuestionIndex + 1}
        totalQuestions={currentQuiz.questions.length}
        timeRemaining={timeRemaining}
        maxTime={600}
        pointsPerQuestion={pointsPerQuestion}
      />
    </div>
  )
}
