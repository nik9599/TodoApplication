import { createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "@/Components/api/axiosConfig";
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
                deleteTaskSuccess: true,
                isDeleteTaskError: false,
            }
        default:
            return state;
    }
}

export const createTask = createAsyncThunk(ACTION_TYPE.CREATE_TASK_REQUEST, async (values, { rejectWithValue }) => {
    try {
         const response = await apiClient.post('/task/create', values);
         return response.data;
    } catch (error) {
        return rejectWithValue({ message: error.message });
    }
})

export const getTasks = createAsyncThunk(ACTION_TYPE.GET_TASKS_REQUEST, async (values, { rejectWithValue }) => {
    try {
        // For GET requests, we need to send query parameters
        const params = new URLSearchParams();
        if (values?.userId) {
            params.append('userId', values.userId);
        }
        
        const url = `/task/get${params.toString() ? '?' + params.toString() : ''}`;
        
        const response = await apiClient.get(url);
        return response.data;
    } catch (error) {
        return rejectWithValue({ message: error.message });
    }
})

export const updateTask = createAsyncThunk(ACTION_TYPE.UPDATE_TASK_REQUEST, async (values, { rejectWithValue }) => {
    try {
        const response = await apiClient.put('/task/update', values);  
        return response.data;
    } catch (error) {
        return rejectWithValue({ message: error.message });
    }
})

 export const deleteTask = createAsyncThunk(ACTION_TYPE.DELETE_TASK_REQUEST, async (values, { rejectWithValue }) => {
    try {
        console.log("values",values)
        const response = await apiClient.delete(`/task/delete/${values}`);
        return response.data;
    } catch (error) {
        return rejectWithValue({ message: error.message });
    }
})
