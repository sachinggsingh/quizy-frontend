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

  const quizContent = (
    <div className="h-screen bg-background relative overflow-hidden flex flex-col">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/10 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 pointer-events-none mix-blend-overlay"></div>
      </div>

      {/* Header */}
      <div className="flex-shrink-0 border-b border-border/10 px-8 py-5 flex items-center justify-between bg-background/40 backdrop-blur-xl z-20">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20">
             <span className="text-xl font-bold text-primary-foreground">Q</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight">
            {currentQuiz.title}
          </h1>
        </div>
        <Button asChild variant="ghost" className="text-muted-foreground hover:text-foreground hover:bg-foreground/5 rounded-full transition-all">
          <Link href="/dashboard" className="flex items-center gap-2">
            <LogOut className="w-4 h-4" />
            <span>Exit</span>
          </Link>
        </Button>
      </div>

      {/* Main Content - Horizontal Layout */}
      <div className="flex-1 flex overflow-hidden z-10">
        {/* Left Side - Questions and Answers */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Content Area - Scrollable */}
          <div className="flex-1 overflow-y-scroll no-scrollbar px-8 py-10">
            <div className="max-w-3xl mx-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentQuestionIndex}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="space-y-8"
                >
                  {/* Question Container */}
                  <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
                    <div className="relative">
                      <QuestionDisplay
                        questionNumber={currentQuestionIndex + 1}
                        totalQuestions={currentQuiz.questions.length}
                        question={question?.text || ""}
                        category={currentQuiz.difficulty}
                      />
                    </div>
                  </div>

                  {/* Answer Options */}
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

                  {/* Feedback Message */}
                  <AnimatePresence>
                    {isSubmitted && question && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                      >
                        <Card className={`overflow-hidden border-2 ${
                          selectedAnswers[currentQuestionIndex.toString()] === question.answer.toString()
                            ? "border-green-500/30 bg-green-500/5"
                            : "border-red-500/30 bg-red-500/5"
                        }`}>
                          <div className="flex items-center gap-3 p-5">
                            {selectedAnswers[currentQuestionIndex.toString()] === question.answer.toString() ? (
                              <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
                                <CheckCircle2 className="w-6 h-6" />
                              </div>
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center text-red-500">
                                <XCircle className="w-6 h-6" />
                              </div>
                            )}
                            <div className="flex-1">
                              <p className={`font-bold text-lg ${
                                selectedAnswers[currentQuestionIndex.toString()] === question.answer.toString() ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                              }`}>
                                {selectedAnswers[currentQuestionIndex.toString()] === question.answer.toString()
                                  ? "Brilliant! That's correct."
                                  : "Not quite. Keep going!"}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {selectedAnswers[currentQuestionIndex.toString()] === question.answer.toString()
                                  ? "You're demonstrating deep understanding here."
                                  : "Review the question and try to find the logic for next time."}
                              </p>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Controls - Fixed at Bottom Left */}
          <div className="flex-shrink-0 border-t border-border/10 px-8 py-6 bg-background/60 backdrop-blur-xl">
            <div className="max-w-3xl mx-auto w-full">
              <QuizControls
                onPrevious={handlePreviousQuestion}
                onNext={handleNextQuestion}
                onSubmit={handleSubmitAnswer}
                canGoPrevious={currentQuestionIndex > 0}
                canGoNext={isSubmitted && currentQuestionIndex < currentQuiz.questions.length - 1}
                hasAnswered={hasAnswered}
                isSubmitted={isSubmitted}
                isLastQuestion={currentQuestionIndex === currentQuiz.questions.length - 1}
              />
            </div>
          </div>
        </div>

        {/* Right Side - Timer and Profile Section */}
        <div className="flex-shrink-0 w-80 border-l border-border/10 bg-background/20 backdrop-blur-lg flex flex-col p-8 gap-10">
          {/* Timer Section Container */}
          <div className="p-6 rounded-3xl bg-card/40 border border-border/50 shadow-2xl shadow-primary/5">
            <h3 className="text-center text-sm font-semibold text-muted-foreground mb-6 flex items-center justify-center gap-2">
              <Timer className="w-4 h-4" />
              TIME REMAINING
            </h3>
            <QuizProgress
              current={currentQuestionIndex + 1}
              total={currentQuiz.questions.length}
              timeRemaining={timeRemaining}
              maxTime={600}
            />
          </div>

          {/* Quick Stats/Tips Area */}
          <div className="flex-1 flex flex-col gap-4">
             <div className="p-5 rounded-2xl bg-primary/5 border border-primary/10">
                <p className="text-xs font-bold text-primary mb-1 uppercase tracking-widest">Question Info</p>
                <div className="flex items-center justify-between">
                   <span className="text-sm text-muted-foreground">Worth</span>
                   <span className="text-sm font-bold text-foreground">{Math.round(currentQuiz.points / currentQuiz.questions.length)} Points</span>
                </div>
             </div>
             <div className="p-5 rounded-2xl bg-accent/5 border border-accent/10">
                <p className="text-xs font-bold text-accent mb-1 uppercase tracking-widest">Global Difficulty</p>
                <span className="text-sm font-bold text-foreground">{currentQuiz.difficulty}</span>
             </div>
          </div>

          {/* Exit Section */}
          <div className="pt-6 border-t border-border/10">
            <Button
              asChild
              variant="outline"
              className="w-full h-14 rounded-2xl border-destructive/20 hover:border-destructive/40 hover:bg-destructive/5 text-destructive font-bold transition-all group"
            >
              <Link href="/dashboard" className="flex items-center justify-center gap-2">
                <Flag className="w-5 h-5 group-hover:animate-bounce" />
                <span>Give Up?</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )

  if (quizCompleted) {
    return (
      <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center p-4">
        {/* Background blobs for result page */}
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-primary/20 rounded-full blur-[140px] animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-accent/20 rounded-full blur-[140px] animate-pulse [animation-delay:1s]" />

        <motion.div
           initial={{ opacity: 0, scale: 0.9, y: 20 }}
           animate={{ opacity: 1, scale: 1, y: 0 }}
           transition={{ type: "spring", damping: 20 }}
           className="w-full max-w-2xl relative z-10"
        >
          <Card className="overflow-hidden border-primary/20 bg-background/40 backdrop-blur-2xl shadow-2xl">
            <div className="bg-gradient-to-r from-primary to-accent p-1 h-2" />
            <div className="p-10 text-center space-y-8">
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full scale-110" />
                <div className="relative w-24 h-24 rounded-3xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-2xl mx-auto transform rotate-12 transition-transform hover:rotate-0 duration-500">
                  <Trophy className="w-12 h-12 text-primary-foreground drop-shadow-lg" />
                </div>
              </div>

              <div className="space-y-2">
                <h1 className="text-5xl font-black tracking-tighter bg-gradient-to-r from-primary via-foreground to-accent bg-clip-text text-transparent italic">
                  CONGRATULATIONS!
                </h1>
                <p className="text-xl font-medium text-muted-foreground">{currentQuiz.title}</p>
              </div>

              <div className="p-8 rounded-[2rem] bg-foreground/5 dark:bg-foreground/10 border border-foreground/5 backdrop-blur-md">
                <div className="flex flex-col items-center">
                  <div className="flex items-baseline gap-2">
                    <span className="text-8xl font-black text-primary drop-shadow-[0_0_25px_rgba(var(--primary-rgb),0.3)]">
                      {score}
                    </span>
                    <span className="text-2xl font-bold text-muted-foreground">/ {currentQuiz.points} pts</span>
                  </div>
                  <p className="text-sm font-bold text-primary/80 uppercase tracking-[0.3em] mt-4">Achievement Unlocked</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 py-2">
                <div className="p-6 rounded-3xl bg-secondary/30 border border-border/50 transition-colors hover:bg-secondary/40">
                  <p className="text-4xl font-black tracking-tight text-foreground">{currentQuiz.questions.length}</p>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">Total Challenges</p>
                </div>
                <div className="p-6 rounded-3xl bg-secondary/30 border border-border/50 transition-colors hover:bg-secondary/40">
                  <p className="text-4xl font-black tracking-tight text-accent">{Object.values(submittedAnswers).length}</p>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">Answers Filed</p>
                </div>
              </div>

              <div className="pt-4">
                <Button
                  asChild
                  className="w-full h-16 rounded-2xl bg-gradient-to-r from-primary to-accent hover:shadow-[0_0_40px_rgba(var(--primary-rgb),0.4)] text-primary-foreground font-black text-xl transition-all hover:-translate-y-1 active:scale-95 shadow-xl"
                >
                  <Link href="/dashboard" className="flex items-center justify-center gap-3">
                    <span>CONTINUE TO DASHBOARD</span>
                    <ArrowRight className="w-6 h-6" />
                  </Link>
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    )
  }

  return quizContent
}
