import { createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '@/Components/api/axiosConfig';
import { REQUEST, SUCCESS, FAILURE } from '@/Components/action-type-utils';

export const ACTION_TYPE = {
  LOGIN_REQUEST: 'LOGIN_REQUEST',
  SIGNUP_REQUEST: 'SIGNUP_REQUEST',
  LOGOUT_REQUEST: 'LOGOUT_REQUEST',
}

// reducer.js
const initialState = {
  data: [],
  loading: false,
  error: null,
  loginSuccess: false,
  signupSuccess: false,
  isSignupError: false,
  isLoginError: false,
  logoutSuccess: false,
  isLogoutError: false,
};

export const loginReducer = (state = initialState, action) => {
  switch (action.type) {
    case REQUEST(ACTION_TYPE.LOGIN_REQUEST):
    case REQUEST(ACTION_TYPE.SIGNUP_REQUEST):
    case REQUEST(ACTION_TYPE.LOGOUT_REQUEST):
      return {
        ...state,
        loading: true,
        error: null,
        signupSuccess: false,
        isSignupError: false,
        loginSuccess: false,
        isLoginError: false,
        logoutSuccess: false,
        isLogoutError: false,
      };
    case FAILURE(ACTION_TYPE.LOGIN_REQUEST):
    case FAILURE(ACTION_TYPE.SIGNUP_REQUEST):
    case FAILURE(ACTION_TYPE.LOGOUT_REQUEST):
      return {
        ...state,
        loading: false,
        error: action.payload.message,
        loginSuccess: false,
        isLoginError: true,
        isSignupError: true,
        logoutSuccess: false,
        isLogoutError: true,
        logoutSuccess: false,
        isLogoutError: true,
      };
    case SUCCESS(ACTION_TYPE.LOGIN_REQUEST):
      return {
        ...state,
        loading: false,
        data: action.payload,
        loginSuccess: true,
        isLoginError: false,
      };
    case SUCCESS(ACTION_TYPE.SIGNUP_REQUEST):
      return {
        ...state,
        loading: false,
        data: action.payload,
        signupSuccess: true,
        isSignupError: false,
      };
    case SUCCESS(ACTION_TYPE.LOGOUT_REQUEST):
      return {
        ...state,
        loading: false,
        data: action.payload,
        logoutSuccess: true,
        isLogoutError: false,
      };
    default:
      return state;
  }
};


export const loginUsers = createAsyncThunk(ACTION_TYPE.LOGIN_REQUEST, async (values, { rejectWithValue }) => {
  try {
    const response = await apiClient.post('/user/login', values);
    return response.data; // ✅ success response
  } catch (error) {
    // ✅ Handle error response from server
    if (error.response && error.response.data) {
      return rejectWithValue(error.response.data); // sends { message: "...", data: null }
    } else {
      return rejectWithValue({ message: error.message });
    }
  }
});

export const signupUsers = createAsyncThunk(ACTION_TYPE.SIGNUP_REQUEST, async (values, { rejectWithValue }) => {
  try {
    const response = await apiClient.post('/user/signup', values);
    return response.data; // ✅ success response
  } catch (error) {
    // ✅ Handle error response from server
    if (error.response && error.response.data) {
      return rejectWithValue(error.response.data); // sends { message: "...", data: null }
    } else {
      return rejectWithValue({ message: error.message });
    }
  }
});

export const logoutUsers = createAsyncThunk(ACTION_TYPE.LOGOUT_REQUEST, async (values, { rejectWithValue }) => {
  try {
    const response = await apiClient.get('/user/logout');
    return response.data; // ✅ success response
  } catch (error) {
    return rejectWithValue({ message: error.message });
  }
});
