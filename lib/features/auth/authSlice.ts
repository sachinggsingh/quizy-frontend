import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { fetchClient } from '../../api'

interface AuthState {
    user: any | null
    token: string | null
    isAuthenticated: boolean
    isLoading: boolean
    error: string | null
}

// Initial state
const initialState: AuthState = {
    user: null,
    token: typeof window !== 'undefined' ? localStorage.getItem('access_token') : null,
    isAuthenticated: typeof window !== 'undefined' ? !!localStorage.getItem('access_token') : false,
    isLoading: false,
    error: null,
}

// Async Thunks
export const loginUser = createAsyncThunk(
    'auth/login',
    async (credentials: any, { rejectWithValue }) => {
        try {
            const response = await fetchClient('/login', {
                method: 'POST',
                body: JSON.stringify(credentials),
            })

            // Store tokens
            localStorage.setItem('access_token', response.access_token)
            if (response.refresh_token) {
                localStorage.setItem('refresh_token', response.refresh_token)
            }

            return response
        } catch (error: any) {
            return rejectWithValue(error.message || 'Login failed')
        }
    }
)

export const registerUser = createAsyncThunk(
    'auth/register',
    async (userData: any, { rejectWithValue }) => {
        try {
            const response = await fetchClient('/users', {
                method: 'POST',
                body: JSON.stringify(userData),
            })
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
            // Clear local storage
            localStorage.removeItem('access_token')
            localStorage.removeItem('refresh_token')
            return null
        } catch (error: any) {
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
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoading = false
                state.isAuthenticated = true
                state.token = action.payload.access_token
                // Ideally fetch user profile here or decode token
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
                // Registration successful, usually redirect to login
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

        // Fetch Profile
        builder
            .addCase(fetchProfile.pending, (state) => {
                state.isLoading = true
            })
            .addCase(fetchProfile.fulfilled, (state, action) => {
                state.isLoading = false
                state.user = action.payload
            })
            .addCase(fetchProfile.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload as string
            })
    },
})

export const { clearError } = authSlice.actions
export default authSlice.reducer
