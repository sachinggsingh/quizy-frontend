import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { fetchClient } from '../../api'

export interface Question {
    id: string
    text: string
    options: string[]
    answer: number
}

export interface Quiz {
    id: string
    title: string
    description?: string
    difficulty?: "Easy" | "Medium" | "Hard" | string
    questions: Question[]
    points: number
    completed?: boolean
    attempted?: boolean
}

interface QuizState {
    quizzes: Quiz[]
    currentQuiz: Quiz | null
    isLoading: boolean
    error: string | null
}

const initialState: QuizState = {
    quizzes: [],
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
            .addCase(fetchQuizByID.pending, (state) => {
                state.isLoading = true
                state.error = null
                state.currentQuiz = null
            })
            .addCase(fetchQuizByID.fulfilled, (state, action) => {
                state.isLoading = false
                state.currentQuiz = action.payload
            })
            .addCase(fetchQuizByID.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload as string
            })
    },
})

export default quizSlice.reducer
