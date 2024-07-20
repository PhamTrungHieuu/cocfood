import axiosInstance from '@/axiosConfig';
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface AuthState {
    isLoggedIn: boolean;
    token: string | null;
    userData: any | null;
    categories: any | null;
    isLoading: boolean;
    error: string | null;
}

interface ApiResponse {
    success: boolean;
    prodCategories: any | null; // Cấu trúc thực tế của phản hồi từ API
}

export const getCategories = createAsyncThunk(
    'auth/categories',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get('http://localhost:5000/api/prodcategory');
            if (!response.data?.success) {
                return rejectWithValue(response.data);
            }
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data || 'Unknown error');
            } else {
                return rejectWithValue('Unknown error');
            }
        }
    }
);

// Async thunk để gọi API và lưu vào local storage
export const fetchUserData = createAsyncThunk(
    'auth/fetchUserData',
    async (_, { getState, rejectWithValue }) => {
        try {
            const state = getState() as { auth: AuthState };
            const token = state.auth.token;

            if (!token) {
                throw new Error('Token not found');
            }

            const response = await axios.get('http://localhost:5000/api/user/current', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const userData = response.data;
            return userData;
        } catch (err) {
            if (axios.isAxiosError(err)) {
                return rejectWithValue(err.response?.data || 'Unknown error');
            } else {
                return rejectWithValue('Unknown error');
            }
        }
    }
);

const initialState: AuthState = {
    isLoggedIn: typeof window !== 'undefined' && !!localStorage.getItem('isLoggedIn'),
    token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
    userData: null,
    categories: null,
    isLoading: false,
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, action: PayloadAction<string>) => {
            state.isLoggedIn = true;
            state.token = action.payload;
            if (typeof window !== 'undefined') {
                // localStorage.setItem('token', action.payload);
                // localStorage.setItem('isLoggedIn', 'true');
            }
        },
        logout: (state) => {
            state.isLoggedIn = false;
            state.token = null;
            state.userData = null;

            // if (typeof window !== 'undefined') {
            //     localStorage.removeItem('token');
            //     localStorage.removeItem('isLoggedIn');
            //     localStorage.removeItem('userData');
            // }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserData.fulfilled, (state, action) => {
                state.userData = action.payload;
            })
            .addCase(getCategories.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getCategories.fulfilled, (state, action) => {
                state.isLoading = false;
                state.categories = action.payload;
            })
            .addCase(getCategories.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload ? action.payload.toString() : 'Failed to fetch categories';
            });
    },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
