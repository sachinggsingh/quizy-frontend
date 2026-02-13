import { useState, useEffect, useCallback } from "react"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { fetchQuizByID, submitQuiz } from "@/lib/features/quiz/quizSlice"
import type { Question } from "@/lib/features/quiz/quizSlice"

export interface UseQuizReturn {
  // State
  currentQuestionIndex: number
  selectedAnswers: { [key: string]: string }
  submittedAnswers: { [key: string]: boolean }
  timeRemaining: number
  quizCompleted: boolean
  score: number
  isSubmitting: boolean
  showMinLoader: boolean
  
  // Current question data
  currentQuestion: Question | null
  hasAnswered: boolean
  isSubmitted: boolean
  isValidQuestion: boolean
  
  // Quiz data
  currentQuiz: any
  isLoading: boolean
  error: string | null | undefined
  
  // Handlers
  handleSelectAnswer: (optionIndex: string) => void
  handleSubmitAnswer: () => void
  handleNextQuestion: () => void
  handlePreviousQuestion: () => void
  handleCompleteQuiz: () => Promise<void>
}

export function useQuiz(quizId: string): UseQuizReturn {
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

  // Fetch quiz on mount
  useEffect(() => {
    if (quizId) {
      dispatch(fetchQuizByID(quizId))
    }
    const timer = setTimeout(() => {
      setShowMinLoader(false)
    }, 2000)
    return () => clearTimeout(timer)
  }, [quizId, dispatch])

  // Get current question
  const currentQuestion = currentQuiz?.questions?.[currentQuestionIndex] || null
  
  // Get question with fallback text if empty
  // Since question text is empty in the API response, we use the question ID as identifier
  const questionWithText: Question | null = currentQuestion ? {
    ...currentQuestion,
    // Use question ID as fallback when text is empty
    text: currentQuestion.text && currentQuestion.text.trim() 
      ? currentQuestion.text 
      : `Question ${currentQuestion.id.slice(-4)}: Select the correct answer`
  } : null

  const hasAnswered = Boolean(questionWithText && (currentQuestionIndex.toString() in selectedAnswers))
  const isSubmitted = Boolean(questionWithText && (currentQuestionIndex.toString() in submittedAnswers))
  
  // Check if question is valid
  const isValidQuestion = Boolean(
    questionWithText && 
    questionWithText.options && 
    Array.isArray(questionWithText.options) && 
    questionWithText.options.length > 0
  )

  // Ensure currentQuestionIndex is within bounds
  useEffect(() => {
    if (currentQuiz && currentQuiz.questions && currentQuestionIndex >= currentQuiz.questions.length) {
      setCurrentQuestionIndex(0)
    }
  }, [currentQuiz, currentQuestionIndex])

  // Timer effect
  const handleCompleteQuiz = useCallback(async () => {
    setQuizCompleted(true)
    setIsSubmitting(true)
    try {
      await dispatch(submitQuiz({ id: quizId, answers: selectedAnswers })).unwrap()
    } catch (err) {
      console.error("Failed to submit quiz:", err)
    } finally {
      setIsSubmitting(false)
    }
  }, [quizId, selectedAnswers, dispatch])

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
  }, [quizCompleted, currentQuiz, handleCompleteQuiz])

  // Calculate score locally for UI
  useEffect(() => {
    if (quizCompleted && currentQuiz) {
      let correctCount = 0
      currentQuiz.questions.forEach((q: Question, index: number) => {
        if (selectedAnswers[index.toString()] === q.answer.toString()) {
          correctCount++
        }
      })
      const earnedPoints = Math.round((correctCount / currentQuiz.questions.length) * currentQuiz.points)
      setScore(earnedPoints)
    }
  }, [quizCompleted, selectedAnswers, currentQuiz])

  // Handlers
  const handleSelectAnswer = useCallback((optionIndex: string) => {
    if (!isSubmitted && questionWithText) {
      setSelectedAnswers((prev) => ({
        ...prev,
        [currentQuestionIndex.toString()]: optionIndex,
      }))
    }
  }, [isSubmitted, questionWithText, currentQuestionIndex])

  const handleSubmitAnswer = useCallback(() => {
    if (questionWithText) {
      setSubmittedAnswers((prev) => ({
        ...prev,
        [currentQuestionIndex.toString()]: true,
      }))
    }
  }, [questionWithText, currentQuestionIndex])

  const handleNextQuestion = useCallback(() => {
    if (!currentQuiz) return
    if (currentQuestionIndex < currentQuiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else {
      handleCompleteQuiz()
    }
  }, [currentQuiz, currentQuestionIndex, handleCompleteQuiz])

  const handlePreviousQuestion = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }, [currentQuestionIndex])

  return {
    // State
    currentQuestionIndex,
    selectedAnswers,
    submittedAnswers,
    timeRemaining,
    quizCompleted,
    score,
    isSubmitting,
    showMinLoader,
    
    // Current question data
    currentQuestion: questionWithText,
    hasAnswered,
    isSubmitted,
    isValidQuestion,
    
    // Quiz data
    currentQuiz,
    isLoading,
    error,
    
    // Handlers
    handleSelectAnswer,
    handleSubmitAnswer,
    handleNextQuestion,
    handlePreviousQuestion,
    handleCompleteQuiz,
  }
}
