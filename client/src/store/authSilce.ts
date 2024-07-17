// store/authSlice.ts
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface AuthState {
    isLoggedIn: boolean;
    token: string | null;
    userData: any | null;
}

const initialState: AuthState = {
    isLoggedIn: typeof window !== 'undefined' && !!localStorage.getItem('isLoggedIn'),
    token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
    userData: typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('userData') || 'null') : null,
};

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

            // Lưu dữ liệu vào local storage
            if (typeof window !== 'undefined') {
                localStorage.setItem('userData', JSON.stringify(userData));
            }

            return userData;
        } catch (err) {
            if (axios.isAxiosError(err)) {
                // Xử lý lỗi từ axios
                return rejectWithValue(err.response?.data || 'Unknown error');
            } else {
                // Xử lý các lỗi khác
                return rejectWithValue('Unknown error');
            }
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, action: PayloadAction<string>) => {
            state.isLoggedIn = true;
            state.token = action.payload;
            if (typeof window !== 'undefined') {
                localStorage.setItem('token', action.payload);
                localStorage.setItem('isLoggedIn', 'true');
            }
        },
        logout: (state) => {
            state.isLoggedIn = false;
            state.token = null;
            state.userData = null;
            if (typeof window !== 'undefined') {
                localStorage.removeItem('token');
                localStorage.removeItem('isLoggedIn');
                localStorage.removeItem('userData');
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserData.fulfilled, (state, action) => {
                state.userData = action.payload;
            })
            // .addCase(fetchUserData.rejected, (state, action) => {
            //     console.error('Error fetching user data:', action.payload);
            // });
    },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
