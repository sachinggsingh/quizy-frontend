import { fetchClient } from "../api"

export interface QuestionResponse {
  id: string
  text: string
  options: string[]
  answer: number
}

/**
 * Fetch a single question by its ID
 */
export async function fetchQuestionById(questionId: string): Promise<QuestionResponse | null> {
  try {
    const response = await fetchClient(`/questions/${questionId}`)
    return response
  } catch (error) {
    console.error(`Failed to fetch question ${questionId}:`, error)
    return null
  }
}

/**
 * Fetch multiple questions by their IDs
 */
export async function fetchQuestionsByIds(questionIds: string[]): Promise<QuestionResponse[]> {
  try {
    const response = await fetchClient(`/questions/batch`, {
      method: 'POST',
      body: JSON.stringify({ questionIds }),
    })
    return response || []
  } catch (error) {
    console.error('Failed to fetch questions:', error)
    return []
  }
}
