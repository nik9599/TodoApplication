import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { REQUEST, SUCCESS, FAILURE } from '@/Components/action-type-utils';

export const ACTION_TYPE = {
  LOGIN_REQUEST: 'LOGIN_REQUEST',
  SIGNUP_REQUEST: 'SIGNUP_REQUEST',
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
};

export const loginReducer = (state = initialState, action) => {
  switch (action.type) {
    case REQUEST(ACTION_TYPE.LOGIN_REQUEST):
    case REQUEST(ACTION_TYPE.SIGNUP_REQUEST):
      return {
        ...state,
        loading: true,
        error: null,
        signupSuccess: false,
        isSignupError: false,
        loginSuccess: false,
        isLoginError: false,
      };
    case FAILURE(ACTION_TYPE.LOGIN_REQUEST):
    case FAILURE(ACTION_TYPE.SIGNUP_REQUEST):
      return {
        ...state,
        loading: false,
        error: action.payload.message,
        loginSuccess: false,
        isLoginError: true,
        isSignupError: true,
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
    default:
      return state;
  }
};


export const loginUsers = createAsyncThunk(ACTION_TYPE.LOGIN_REQUEST, async (values, { rejectWithValue }) => {
  try {
    const response = await axios.post('http://localhost:8000/user/login', values);
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
    const response = await axios.post('http://localhost:8000/user/signup', values);
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
