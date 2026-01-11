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
import { LoaderThree, LoaderFive } from "@/components/ui/loader"
import { motion, AnimatePresence } from "framer-motion"
import { Trophy, CheckCircle2, XCircle, Timer, ArrowRight, ArrowLeft, Flag, LogOut } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard-header"

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
  const [showMinLoader, setShowMinLoader] = useState(true)

  useEffect(() => {
    if (id) {
      dispatch(fetchQuizByID(id))
    }
    const timer = setTimeout(() => {
      setShowMinLoader(false)
    }, 2000)
    return () => clearTimeout(timer)
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

  if ((isLoading || showMinLoader) || (!currentQuiz && !error)) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 gap-6">
        <LoaderThree />
        <LoaderFive text="Preparing Quiz..." />
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

  const content = (
    <div className="min-h-screen bg-background relative overflow-x-hidden no-scrollbar">
      <DashboardHeader />
      
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/20 rounded-full blur-[120px]" />
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {!quizCompleted ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Side: Question area */}
            <div className="lg:col-span-2 space-y-8">
              <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">
                  {currentQuiz.title}
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
                  <QuestionDisplay
                    questionNumber={currentQuestionIndex + 1}
                    totalQuestions={currentQuiz.questions.length}
                    question={question?.text || ""}
                    category={currentQuiz.difficulty}
                  />

                  <div className="grid grid-cols-1 gap-4">
                    {question?.options.map((option, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 + 0.2 }}
                      >
                        <AnswerOption
                          id={index.toString()}
                          text={option}
                          isSelected={selectedAnswers[currentQuestionIndex.toString()] === index.toString()}
                          isCorrect={index === question.answer}
                          isSubmitted={isSubmitted}
                          onSelect={handleSelectAnswer}
                        />
                      </motion.div>
                    ))}
                  </div>

                  {isSubmitted && question && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                    >
                      <Card className={`overflow-hidden border-2 ${
                        selectedAnswers[currentQuestionIndex.toString()] === question.answer.toString()
                          ? "border-green-500/30 bg-green-500/5"
                          : "border-red-500/30 bg-red-500/5"
                      }`}>
                        <div className="flex items-center gap-3 p-5">
                          {selectedAnswers[currentQuestionIndex.toString()] === question.answer.toString() ? (
                            <CheckCircle2 className="w-6 h-6 text-green-500" />
                          ) : (
                            <XCircle className="w-6 h-6 text-red-500" />
                          )}
                          <p className={`font-bold ${
                            selectedAnswers[currentQuestionIndex.toString()] === question.answer.toString() ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                          }`}>
                            {selectedAnswers[currentQuestionIndex.toString()] === question.answer.toString()
                              ? "Correct! Well done."
                              : "Incorrect. Better luck with the next one!"}
                          </p>
                        </div>
                      </Card>
                    </motion.div>
                  )}
                </motion.div>
              </AnimatePresence>

              <div className="pt-4">
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

            {/* Right Side: Sidebar info */}
            <div className="lg:col-span-1 space-y-6">
              <Card className="p-6 border-primary/20 bg-card/80 backdrop-blur-sm sticky top-24">
                <h3 className="text-sm font-semibold text-muted-foreground mb-6 flex items-center gap-2">
                  <Timer className="w-4 h-4" />
                  TIME REMAINING
                </h3>
                <QuizProgress
                  current={currentQuestionIndex + 1}
                  total={currentQuiz.questions.length}
                  timeRemaining={timeRemaining}
                  maxTime={600}
                />
                <div className="mt-8 pt-6 border-t border-border/50">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm text-muted-foreground">Point Value</span>
                    <span className="text-sm font-bold">{Math.round(currentQuiz.points / currentQuiz.questions.length)} pts</span>
                  </div>
                  <Button asChild variant="outline" className="w-full text-red-500 border-red-500/20 hover:bg-red-500/5">
                    <Link href="/dashboard">Exit Quiz</Link>
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        ) : (
          /* Completion Screen - Using Website UI styles */
          <div className="max-w-4xl mx-auto py-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center space-y-8"
            >
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-primary/10 border-2 border-primary/20 mb-4">
                <Trophy className="w-12 h-12 text-primary" />
              </div>
              
              <div className="space-y-4">
                <h1 className="text-5xl font-black tracking-tight text-foreground">
                  Quiz Completed!
                </h1>
                <p className="text-xl text-muted-foreground">
                  You've successfully finished <span className="text-primary font-bold">{currentQuiz.title}</span>
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-8 border-primary/20 bg-primary/5">
                  <p className="text-4xl font-black text-primary mb-1">{score} <span className="text-lg opacity-60">/ {currentQuiz.points}</span></p>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Points Earned</p>
                </Card>
                <Card className="p-8 border-border/50">
                  <p className="text-4xl font-black text-foreground mb-1">{currentQuiz.questions.length}</p>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Questions</p>
                </Card>
                <Card className="p-8 border-border/50">
                  <p className="text-4xl font-black text-accent mb-1">{Object.keys(submittedAnswers).length}</p>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Answered</p>
                </Card>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
                <Button asChild className="h-14 px-8 rounded-xl bg-primary text-primary-foreground font-bold text-lg">
                  <Link href="/dashboard">Back to Dashboard</Link>
                </Button>
                <Button asChild variant="outline" className="h-14 px-8 rounded-xl border-border/50 font-bold text-lg">
                  <Link href="/leaderboard">View Leaderboard</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </main>
    </div>
  )

  return content
}
