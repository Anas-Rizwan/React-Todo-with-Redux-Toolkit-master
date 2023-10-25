import { configureStore } from '@reduxjs/toolkit'
import todoSlice from './slices/UserSlice'

const store = configureStore({
    reducer: {
        todos: todoSlice,
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
})

export default store;