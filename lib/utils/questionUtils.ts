import type { Question } from "@/lib/features/quiz/quizSlice"

/**
 * Find a question by ID from the questions array
 */
export function getQuestionById(questions: Question[], questionId: string): Question | null {
  return questions.find(q => q.id === questionId) || null
}

/**
 * Get question text by ID, with fallback
 */
export function getQuestionText(questions: Question[], questionId: string, fallback?: string): string {
  const question = getQuestionById(questions, questionId)
  if (question?.text && question.text.trim()) {
    return question.text
  }
  return fallback || `Question ${questionId.slice(-4)}`
}

/**
 * Get question by index with ID lookup fallback
 */
export function getQuestionByIndexOrId(
  questions: Question[], 
  index: number, 
  questionId?: string
): Question | null {
  // First try by index
  if (index >= 0 && index < questions.length) {
    return questions[index]
  }
  
  // Fallback to ID lookup
  if (questionId) {
    return getQuestionById(questions, questionId)
  }
  
  return null
}
