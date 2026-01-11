import { configureStore } from '@reduxjs/toolkit'
import authReducer from './features/auth/authSlice'
import quizReducer from './features/quiz/quizSlice'

export const makeStore = () => {
    return configureStore({
        reducer: {
            auth: authReducer,
            quiz: quizReducer,
        },
    })
}

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
