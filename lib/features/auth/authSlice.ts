import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { fetchClient } from '../../api'

interface AuthState {
    user: any | null
    token: string | null
    isAuthenticated: boolean
    isLoading: boolean
    authCheckDone: boolean // true after first fetchProfile attempt (so we don't redirect before trying cookies)
    error: string | null
}

// Initial state - cookies are handled automatically by the browser
const initialState: AuthState = {
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
    authCheckDone: false,
    error: null,
}

// Async Thunks
export const loginUser = createAsyncThunk(
    'auth/login',
    async (credentials: any, { rejectWithValue, dispatch }) => {
        try {
            const response = await fetchClient('/login', {
                method: 'POST',
                body: JSON.stringify(credentials),
            })

            // Tokens are now stored in HTTP-only cookies by the backend
            // No need to store them in localStorage
            // Backend still returns tokens in response for backward compatibility

            // Fetch user profile immediately after login
            await dispatch(fetchProfile())

            return response
        } catch (error: any) {
            return rejectWithValue(error.message || 'Login failed')
        }
    }
)

export const registerUser = createAsyncThunk(
    'auth/register',
    async (userData: any, { rejectWithValue, dispatch }) => {
        try {
            const response = await fetchClient('/users', {
                method: 'POST',
                body: JSON.stringify(userData),
            })

            // Backend now auto-logs in after registration and sets cookies
            // If tokens are present in response, fetch user profile
            if (response.access_token || response.user) {
                // Fetch user profile to populate state
                await dispatch(fetchProfile())
            }

            return response
        } catch (error: any) {
            return rejectWithValue(error.message || 'Registration failed')
        }
    }
)

export const fetchProfile = createAsyncThunk(
    'auth/fetchProfile',
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetchClient('/me')
            return response
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to fetch profile')
        }
    }
)

export const logoutUser = createAsyncThunk(
    'auth/logout',
    async (_, { rejectWithValue }) => {
        try {
            // Call backend logout endpoint to clear cookies
            await fetchClient('/logout', {
                method: 'POST',
            })
            
            // Clear any remaining localStorage items (for backward compatibility)
            if (typeof window !== 'undefined') {
                localStorage.removeItem('access_token')
                localStorage.removeItem('refresh_token')
            }
            
            return null
        } catch (error: any) {
            // Even if logout fails, clear local state
            if (typeof window !== 'undefined') {
                localStorage.removeItem('access_token')
                localStorage.removeItem('refresh_token')
            }
            return rejectWithValue(error.message)
        }
    }
)

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null
        },
    },
    extraReducers: (builder) => {
        // Login
        builder
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(loginUser.fulfilled, (state) => {
                state.isLoading = false
                state.isAuthenticated = true // Cookies are set, user is authenticated
                state.token = null // Tokens are in cookies, not stored in state
                // User profile is automatically fetched by loginUser thunk
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload as string
            })

        // Register
        builder
            .addCase(registerUser.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(registerUser.fulfilled, (state) => {
                state.isLoading = false
                // If auto-login was successful, isAuthenticated will be set by fetchProfile
                // Otherwise, user will be redirected to sign-in page
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload as string
            })

        // Logout
        builder.addCase(logoutUser.fulfilled, (state) => {
            state.user = null
            state.token = null
            state.isAuthenticated = false
        })

        // Fetch Profile — normalize backend response (snake_case) to camelCase for UI
        builder
            .addCase(fetchProfile.pending, (state) => {
                state.isLoading = true
            })
            .addCase(fetchProfile.fulfilled, (state, action) => {
                state.isLoading = false
                state.authCheckDone = true
                state.isAuthenticated = true
                const p = action.payload as any
                const completedIds = p?.completed_quiz_ids ?? p?.completedQuizIds ?? []
                state.user = {
                    ...p,
                    completedQuizzes: Array.isArray(completedIds) ? completedIds.length : (p?.completedQuizzes ?? 0),
                    completedQuizIds: Array.isArray(completedIds) ? completedIds : [],
                    averageScore: typeof p?.average_score === 'number' ? p.average_score : (p?.averageScore ?? 0),
                }
            })
            .addCase(fetchProfile.rejected, (state, action) => {
                state.isLoading = false
                state.authCheckDone = true
                state.error = action.payload as string
            })
    },
})

export const { clearError } = authSlice.actions
export default authSlice.reducer
