import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { fetchClient } from '../../api'
import { getQuestionById } from '../../utils/questionUtils'

export interface Question {
    id: string
    text: string
    options: string[]
    answer: number
}

export interface Quiz {
    id: string
    quiz_id?: string // UUID-style ID used for fetching/routing
    title: string
    description?: string
    difficulty?: "Easy" | "Medium" | "Hard" | string
    questions: Question[]
    points: number
    category?: string
    completed?: boolean
    attempted?: boolean
}

export interface QuizState {
    quizzes: Quiz[]
    categorizedQuizzes: { [key: string]: Quiz[] }
    currentQuiz: Quiz | null
    isLoading: boolean
    error: string | null
}

const initialState: QuizState = {
    quizzes: [],
    categorizedQuizzes: {},
    currentQuiz: null,
    isLoading: false,
    error: null,
}

export const fetchQuizzes = createAsyncThunk(
    'quiz/fetchQuizzes',
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetchClient('/quizzes')
            return response
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to fetch quizzes')
        }
    }
)

export const fetchQuizzesByCategories = createAsyncThunk(
    'quiz/fetchQuizzesByCategories',
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetchClient('/quizzes/categories')
            return response
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to fetch categorized quizzes')
        }
    }
)

export const fetchQuizByID = createAsyncThunk(
    'quiz/fetchQuizByID',
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await fetchClient(`/quizzes/${id}`)
            return response
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to fetch quiz')
        }
    }
)

export const submitQuiz = createAsyncThunk(
    'quiz/submitQuiz',
    async ({ id, answers }: { id: string; answers: { [key: string]: string } }, { rejectWithValue }) => {
        try {
            const response = await fetchClient(`/quizzes/${id}/submit`, {
                method: 'POST',
                body: JSON.stringify({ answers }),
            })
            return response
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to submit quiz')
        }
    }
)
const quizSlice = createSlice({
    name: 'quiz',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchQuizzes.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(fetchQuizzes.fulfilled, (state, action) => {
                state.isLoading = false
                state.quizzes = action.payload || []
            })
            .addCase(fetchQuizzes.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload as string
            })
            .addCase(fetchQuizzesByCategories.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(fetchQuizzesByCategories.fulfilled, (state, action) => {
                state.isLoading = false
                state.categorizedQuizzes = action.payload || {}
                // Flatten the categorize map into state.quizzes for use in general filter logic
                state.quizzes = Object.values(state.categorizedQuizzes).flat()
            })
            .addCase(fetchQuizzesByCategories.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload as string
            })
            .addCase(fetchQuizByID.pending, (state) => {
                state.isLoading = true
                state.error = null
                state.currentQuiz = null
            })
            .addCase(fetchQuizByID.fulfilled, (state, action) => {
                state.isLoading = false
                const quiz = action.payload
                
                // Debug: Log raw response from API
                console.log('Raw quiz response from API:', {
                    quizId: quiz?.id,
                    quizIdField: quiz?.quiz_id,
                    title: quiz?.title,
                    questionsCount: quiz?.questions?.length || 0,
                    questions: quiz?.questions,
                    fullPayload: quiz
                })
                
                // Ensure questions array exists and is properly formatted
                if (quiz) {
                    if (!quiz.questions || !Array.isArray(quiz.questions)) {
                        console.error('Quiz loaded but questions array is missing or invalid:', {
                            quiz: quiz,
                            questionsType: typeof quiz.questions,
                            questionsValue: quiz.questions
                        })
                        quiz.questions = []
                    } else {
                        // Validate and normalize each question
                        quiz.questions = quiz.questions.map((q: any, idx: number) => {
                            // Ensure options is an array
                            let options = q.options
                            if (!options) {
                                console.warn(`Question ${idx} (id: ${q.id}) has no options field`)
                                options = []
                            } else if (!Array.isArray(options)) {
                                console.warn(`Question ${idx} (id: ${q.id}) options is not an array:`, typeof options, options)
                                options = []
                            }
                            
                            // Log detailed options info
                            console.log(`Question ${idx} normalized:`, {
                                id: q.id,
                                text: q.text || '(empty)',
                                optionsType: typeof options,
                                isArray: Array.isArray(options),
                                optionsLength: options?.length || 0,
                                options: options,
                                optionsContent: Array.isArray(options) ? options.map((opt: any, i: number) => ({
                                    index: i,
                                    value: opt,
                                    type: typeof opt
                                })) : 'not an array',
                                answer: q.answer
                            })
                            
                            return {
                                ...q,
                                id: q.id || '',
                                text: q.text || '',
                                options: options || [],
                                answer: typeof q.answer === 'number' ? q.answer : parseInt(q.answer) || 0
                            } as Question
                        })
                        console.log(`Quiz loaded successfully with ${quiz.questions.length} questions`)
                    }
                } else {
                    console.error('Quiz payload is null or undefined')
                }
                
                state.currentQuiz = quiz
            })
            .addCase(fetchQuizByID.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload as string
            })
    },
})

export default quizSlice.reducer

// Helper function to get question by ID from current quiz
export function getQuestionFromCurrentQuiz(state: QuizState, questionId: string): Question | null {
    if (state.currentQuiz && state.currentQuiz.questions) {
        return getQuestionById(state.currentQuiz.questions, questionId)
    }
    return null
}
