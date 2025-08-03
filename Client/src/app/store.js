import { configureStore } from '@reduxjs/toolkit'
import { loginReducer } from './Auth/reducer/login.reducer'

export const store = configureStore({
  reducer: {
    login: loginReducer,
  },
})