"use client"

import { useState, useEffect } from "react"
import { QuizProgress } from "@/components/quiz-progress"
import { QuestionDisplay } from "@/components/question-display"
import { AnswerOption } from "@/components/answer-option"
import { QuizControls } from "@/components/quiz-controls"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { fetchQuizByID, submitQuiz } from "@/lib/features/quiz/quizSlice"
import { useParams } from "next/navigation"

export default function QuizPage() {
  const params = useParams()
  const id = params.id as string
  const dispatch = useAppDispatch()
  const { currentQuiz, isLoading, error } = useAppSelector((state) => state.quiz)

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: string]: string }>({})
  const [submittedAnswers, setSubmittedAnswers] = useState<{ [key: string]: boolean }>({})
  const [timeRemaining, setTimeRemaining] = useState(600) // Default 10 mins
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [score, setScore] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (id) {
      dispatch(fetchQuizByID(id))
    }
  }, [id, dispatch])

  const handleCompleteQuiz = async () => {
    setQuizCompleted(true)
    setIsSubmitting(true)
    try {
      await dispatch(submitQuiz({ id, answers: selectedAnswers })).unwrap()
    } catch (err) {
      console.error("Failed to submit quiz:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const question = currentQuiz?.questions[currentQuestionIndex]
  const hasAnswered = question ? (currentQuestionIndex.toString() in selectedAnswers) : false
  const isSubmitted = question ? (currentQuestionIndex.toString() in submittedAnswers) : false

  // Timer effect
  useEffect(() => {
    if (quizCompleted || !currentQuiz) return

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          handleCompleteQuiz()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [quizCompleted, currentQuiz])

  // Calculate score locally for UI
  useEffect(() => {
    if (quizCompleted && currentQuiz) {
      let correctCount = 0
      currentQuiz.questions.forEach((q, index) => {
        if (selectedAnswers[index.toString()] === q.answer.toString()) {
          correctCount++
        }
      })
      const earnedPoints = Math.round((correctCount / currentQuiz.questions.length) * currentQuiz.points)
      setScore(earnedPoints)
    }
  }, [quizCompleted, selectedAnswers, currentQuiz])

  const handleSelectAnswer = (optionIndex: string) => {
    if (!isSubmitted && question) {
      setSelectedAnswers((prev) => ({
        ...prev,
        [currentQuestionIndex.toString()]: optionIndex,
      }))
    }
  }

  const handleSubmitAnswer = () => {
    if (question) {
      setSubmittedAnswers((prev) => ({
        ...prev,
        [currentQuestionIndex.toString()]: true,
      }))
    }
  }

  const handleNextQuestion = () => {
    if (!currentQuiz) return
    if (currentQuestionIndex < currentQuiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else {
      handleCompleteQuiz()
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <p className="text-xl text-muted-foreground animate-pulse">Loading Quiz...</p>
      </div>
    )
  }

  if (error || !currentQuiz) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="p-8 text-center space-y-4 max-w-md">
          <h2 className="text-2xl font-bold text-red-500">Error</h2>
          <p className="text-muted-foreground">{error || "Quiz not found"}</p>
          <Button asChild>
            <Link href="/dashboard">Back to Dashboard</Link>
          </Button>
        </Card>
      </div>
    )
  }

  if (quizCompleted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl border-primary/20 bg-card/50 backdrop-blur-sm">
          <div className="p-8 text-center space-y-6">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Quiz Completed!
              </h1>
              <p className="text-xl text-muted-foreground">{currentQuiz.title}</p>
            </div>

            <div className="py-8">
              <div className="text-6xl font-bold text-primary mb-2">
                {score} <span className="text-2xl text-muted-foreground">/ {currentQuiz.points}</span>
              </div>
              <p className="text-muted-foreground">Points Earned</p>
            </div>

            <div className="grid grid-cols-2 gap-4 py-6">
              <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                <p className="text-2xl font-bold text-primary">{currentQuiz.questions.length}</p>
                <p className="text-sm text-muted-foreground">Total Questions</p>
              </div>
              <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
                <p className="text-2xl font-bold text-accent">{Object.values(submittedAnswers).length}</p>
                <p className="text-sm text-muted-foreground">Answered</p>
              </div>
            </div>

            <div className="flex gap-3 justify-center pt-6">
              <Button
                asChild
                variant="outline"
                className="border-border/50 hover:border-primary/50 hover:bg-primary/10 bg-transparent"
              >
                <Link href="/dashboard">Back to Dashboard</Link>
              </Button>
              <Button
                asChild
                className="bg-gradient-to-r from-primary to-accent hover:shadow-lg hover:shadow-primary/50 text-primary-foreground"
              >
                <Link href={`/results/${currentQuiz.id}`}>View Detailed Results</Link>
              </Button>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            {currentQuiz.title}
          </h1>
          <Button asChild variant="ghost" className="text-muted-foreground hover:text-foreground">
            <Link href="/dashboard">Exit</Link>
          </Button>
        </div>

        {/* Progress */}
        <QuizProgress current={currentQuestionIndex + 1} total={currentQuiz.questions.length} timeRemaining={timeRemaining} />

        {/* Question */}
        <QuestionDisplay
          questionNumber={currentQuestionIndex + 1}
          totalQuestions={currentQuiz.questions.length}
          question={question?.text || ""}
          category="Quiz" // Category not in backend model yet
        />

        {/* Answer Options */}
        <div className="space-y-3">
          {question?.options.map((option, index) => (
            <AnswerOption
              key={index}
              id={index.toString()}
              text={option}
              isSelected={selectedAnswers[currentQuestionIndex.toString()] === index.toString()}
              isCorrect={index === question.answer}
              isSubmitted={isSubmitted}
              onSelect={handleSelectAnswer}
            />
          ))}
        </div>

        {/* Feedback Message */}
        {isSubmitted && question && (
          <Card className="border-border/50 bg-primary/5 p-4">
            <p className="text-sm font-medium text-foreground">
              {selectedAnswers[currentQuestionIndex.toString()] === question.answer.toString()
                ? "✓ Correct! Move to the next question to continue."
                : "✗ Incorrect. Try to remember this for next time!"}
            </p>
          </Card>
        )}

        {/* Controls */}
        <QuizControls
          onPrevious={handlePreviousQuestion}
          onNext={handleNextQuestion}
          onSubmit={handleSubmitAnswer}
          canGoPrevious={currentQuestionIndex > 0}
          canGoNext={isSubmitted}
          hasAnswered={hasAnswered}
          isSubmitted={isSubmitted}
          isLastQuestion={currentQuestionIndex === currentQuiz.questions.length - 1}
        />
      </div>
    </div>
  )
}
