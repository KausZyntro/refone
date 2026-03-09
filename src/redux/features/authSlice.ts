import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authAPI } from "@/services/api";

export const loginUser = createAsyncThunk(
    "/login",
    async ({ email, password }: any, { rejectWithValue }) => {
        try {
            const response = await authAPI.login(email, password);
            // Assuming response structure has token and User object
            // localStorage.setItem("token", response.token || response.data?.token);
            return response.data || response;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Login failed");
        }
    }
);

export const registerUser = createAsyncThunk(
    "/register",
    async (userData: any, { rejectWithValue }) => {
        try {
            const response = await authAPI.register(userData);
            // Wait for user to explicitly login after register, or login immediately if returned
            if (response.token || response.data?.token) {
                localStorage.setItem("token", response.token || response.data?.token);
            }
            return response.data || response;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Registration failed");
        }
    }
);

export const verifyOtpUser = createAsyncThunk(
    "/verify-otp",
    async ({ user_id, otp }: { user_id: number, otp: string }, { rejectWithValue }) => {
        try {
            const response = await authAPI.verifyOTP(user_id, otp, "web");
            if (response.token || response.data?.token) {
                localStorage.setItem("token", response.token || response.data?.token);
            }
            return response.data || response;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "OTP Verification failed");
        }
    }
);

interface AuthState {
    user: any | null;
    token: string | null;
    isLoading: boolean;
    error: string | null;
    registerSuccess: boolean;
}

const initialState: AuthState = {
    user: null,
    token: typeof window !== "undefined" ? localStorage.getItem("token") : null,
    isLoading: false,
    error: null,
    registerSuccess: false,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.token = null;
            if (typeof window !== "undefined") {
                localStorage.removeItem("token");
            }
        },
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        // Login
        builder.addCase(loginUser.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(loginUser.fulfilled, (state, { payload }) => {
            state.isLoading = false;
            state.user = payload.user || payload;
            state.token = payload.token || localStorage.getItem("token");
        });
        builder.addCase(loginUser.rejected, (state, { payload }) => {
            state.isLoading = false;
            state.error = payload as string;
        });

        // Register
        builder.addCase(registerUser.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(registerUser.fulfilled, (state, { payload }) => {
            state.isLoading = false;
            state.registerSuccess = true;
            state.user = payload.user || payload;
            state.token = payload.token || localStorage.getItem("token");
        });
        builder.addCase(registerUser.rejected, (state, { payload }) => {
            state.isLoading = false;
            state.error = payload as string;
        });

        // Verify OTP
        builder.addCase(verifyOtpUser.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(verifyOtpUser.fulfilled, (state, { payload }) => {
            state.isLoading = false;
            state.user = payload.user || payload;
            state.token = payload.token || localStorage.getItem("token");
        });
        builder.addCase(verifyOtpUser.rejected, (state, { payload }) => {
            state.isLoading = false;
            state.error = payload as string;
        });
    },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
