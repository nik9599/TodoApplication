import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { REQUEST, SUCCESS, FAILURE } from "@/Components/action-type-utils";

export const ACTION_TYPE = {
    CREATE_TASK_REQUEST: 'CREATE_TASK_REQUEST',
    GET_TASKS_REQUEST: 'GET_TASKS_REQUEST',
    UPDATE_TASK_REQUEST: 'UPDATE_TASK_REQUEST',
    DELETE_TASK_REQUEST: 'DELETE_TASK_REQUEST',
}

const initialState = {
    data: [],
    loading: false,
    error: null,
    createTaskSuccess: false,
    isCreateTaskError: false,
    getTasksSuccess: false,
    isGetTasksError: false,
    updateTaskSuccess: false,
    isUpdateTaskError: false,
    deleteTaskSuccess: false,
    isDeleteTaskError: false,
}

export const taskReducer = (state = initialState, action) => {
    switch (action.type) {
        case REQUEST(ACTION_TYPE.CREATE_TASK_REQUEST):
            case REQUEST(ACTION_TYPE.GET_TASKS_REQUEST):
            case REQUEST(ACTION_TYPE.UPDATE_TASK_REQUEST):
            case REQUEST(ACTION_TYPE.DELETE_TASK_REQUEST):
            return {
                ...state,
                loading: true,
                error: null,
                createTaskSuccess: false,
                isCreateTaskError: false,
                getTasksSuccess: false,
                isGetTasksError: false,
                updateTaskSuccess: false,
                isUpdateTaskError: false,
                deleteTaskSuccess: false,
                isDeleteTaskError: false,
            }
        case FAILURE(ACTION_TYPE.CREATE_TASK_REQUEST):
            case FAILURE(ACTION_TYPE.GET_TASKS_REQUEST):
            case FAILURE(ACTION_TYPE.UPDATE_TASK_REQUEST):
            case FAILURE(ACTION_TYPE.DELETE_TASK_REQUEST):
            return {
                ...state,
                loading: false,
                error: action.payload.message,
                createTaskSuccess: false,
                isCreateTaskError: true,
                getTasksSuccess: false,
                isGetTasksError: true,
                updateTaskSuccess: false,
                isUpdateTaskError: true,
                deleteTaskSuccess: false,
                isDeleteTaskError: true,
            }
        case SUCCESS(ACTION_TYPE.CREATE_TASK_REQUEST):
            return {
                ...state,
                loading: false,
                data: action.payload,
                createTaskSuccess: true,
                isCreateTaskError: false,
            }
        case SUCCESS(ACTION_TYPE.GET_TASKS_REQUEST):
            return {
                ...state,
                loading: false,
                data: action.payload,
                getTasksSuccess: true,
                isGetTasksError: false,
            }
        case SUCCESS(ACTION_TYPE.UPDATE_TASK_REQUEST):
            return {
                ...state,
                loading: false,
                data: action.payload,
                updateTaskSuccess: true,
                isUpdateTaskError: false,
                }
        case SUCCESS(ACTION_TYPE.DELETE_TASK_REQUEST):
            return {
                ...state,
                loading: false,
                data: action.payload,
                deleteTaskSuccess: true,
                isDeleteTaskError: false,
            }
        default:
            return state;
    }
}

export const createTask = createAsyncThunk(ACTION_TYPE.CREATE_TASK_REQUEST, async (values, { rejectWithValue }) => {
    try {
         const response = await axios.post('http://localhost:8000/task/create', values);
         return response.data;
    } catch (error) {
        return rejectWithValue({ message: error.message });
    }
})

export const getTasks = createAsyncThunk(ACTION_TYPE.GET_TASKS_REQUEST, async (values, { rejectWithValue }) => {        
    try {
        const response = await axios.get('http://localhost:8000/task/get', values);
        return response.data;
    } catch (error) {
        return rejectWithValue({ message: error.message });
    }
})

export const updateTask = createAsyncThunk(ACTION_TYPE.UPDATE_TASK_REQUEST, async (values, { rejectWithValue }) => {
    try {
        const response = await axios.put('http://localhost:8000/task/update', values);  
        return response.data;
    } catch (error) {
        return rejectWithValue({ message: error.message });
    }
})

 export const deleteTask = createAsyncThunk(ACTION_TYPE.DELETE_TASK_REQUEST, async (values, { rejectWithValue }) => {
    try {
        const response = await axios.delete('http://localhost:8000/task/delete', values);
        return response.data;
    } catch (error) {
        return rejectWithValue({ message: error.message });
    }
})
