import { configureStore } from '@reduxjs/toolkit'
import { loginReducer } from './Auth/reducer/login.reducer'
import { taskReducer } from './TaskReducer/TaskReducer.reducer'

export const store = configureStore({
  reducer: {
    login: loginReducer,
    task: taskReducer,
  },
})