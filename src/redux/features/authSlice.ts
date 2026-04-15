import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authAPI, userAPI } from "@/services/api";
import { parse } from "path";

/* ---------------- TOKEN HELPER ---------------- */

const getToken = () => {
  if (typeof window === "undefined") return null;

  const auth = localStorage.getItem("auth");
  if (!auth) return null;

  const { token, expiry } = JSON.parse(auth);

  if (Date.now() > expiry) {
    localStorage.removeItem("auth");
    return null;
  }

  return token;
};

const getUser = () => {
  if (typeof window === "undefined") return null;
  const auth = localStorage.getItem("auth");
  if (!auth) return null;

  const { user, expiry } = JSON.parse(auth);
  if (Date.now() > expiry) {
    localStorage.removeItem("auth");
    return null;
  }
  return user;
}
/* ---------------- LOGIN ---------------- */

export const loginUser = createAsyncThunk(
  "auth/login",
  async ({ email: identifier, password }: { email: string; password?: string }, { rejectWithValue }) => {
    try {
      const response = await authAPI.login(identifier, password);
      return response.data || response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Login failed"
      );
    }
  }
);

/* ---------------- REGISTER ---------------- */

export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData: any, { rejectWithValue }) => {
    try {
      const response = await authAPI.register(userData);
      return response.data || response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Registration failed"
      );
    }
  }
);

/* ---------------- VERIFY OTP ---------------- */

export const verifyOtpUser = createAsyncThunk(
  "auth/verify-otp",
  async (
    { user_id, otp }: { user_id: number; otp: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await authAPI.verifyOTP(user_id, otp, "web");
      // console.log(response?.data?.user);
      const token = response?.data?.token;
      const maxTime = response?.data?.refreshTime
      const hour = parseInt(maxTime);
      console.log(hour)
      const maxTimeInSeconds = hour * 60 * 60;
      console.log(maxTimeInSeconds)
      if (token) {
        // const expiry = Date.now() + 24 * 60 * 60 * 1000;

        // Set token in cookies for Next.js middleware (Valid for 24 hours)
        document.cookie = `token=${token}; path=/; max-age=${maxTimeInSeconds}; SameSite=Lax; Secure`;
        const expiry = Date.now() + maxTimeInSeconds * 1000;

        localStorage.setItem(
          "auth",
          JSON.stringify({
            token,
            user: response?.data?.user,
            expiry,
          })
        );
      }

      return response.data || response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "OTP Verification failed"
      );
    }
  }
);

/* ---------------- UPDATE PROFILE ---------------- */

export const updateProfileThunk = createAsyncThunk(
  "auth/update-profile",
  async (userData: { name: string; email: string; phone: string }, { rejectWithValue }) => {
    try {
      const response = await userAPI.updateProfile(userData);
      if (response.status === "SUCCESS") {
        const auth = localStorage.getItem("auth");
        if (auth) {
          const parsedAuth = JSON.parse(auth);
          localStorage.setItem(
            "auth",
            JSON.stringify({
              ...parsedAuth,
              user: response.data,
            })
          );
        }
        return response.data;
      }
      return rejectWithValue(response.message || "Update failed");
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Profile update failed"
      );
    }
  }
);

/* ---------------- STATE ---------------- */

interface AuthState {
  user: any | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  registerSuccess: boolean;
  isLoginModalOpen: boolean;
  redirectPath: string | null;
}

const initialState: AuthState = {
  user: getUser(),
  token: getToken(),
  isLoading: false,
  error: null,
  registerSuccess: false,
  isLoginModalOpen: false,
  redirectPath: null,
};

/* ---------------- SLICE ---------------- */

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;

      if (typeof window !== "undefined") {
        localStorage.removeItem("auth");
        document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax; Secure";
      }
    },

    clearError: (state) => {
      state.error = null;
    },

    openLoginModal: (state) => {
      state.isLoginModalOpen = true;
    },

    closeLoginModal: (state) => {
      state.isLoginModalOpen = false;
    },

    setRedirectPath: (state, action) => {
      state.redirectPath = action.payload;
    },

    clearRedirectPath: (state) => {
      state.redirectPath = null;
    },
  },

  extraReducers: (builder) => {
    /* LOGIN */

    builder.addCase(loginUser.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });

    builder.addCase(loginUser.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.user = payload?.data || payload;
      state.token = getToken();
    });

    builder.addCase(loginUser.rejected, (state, { payload }) => {
      state.isLoading = false;
      state.error = payload as string;
    });

    /* REGISTER */

    builder.addCase(registerUser.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });

    builder.addCase(registerUser.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.registerSuccess = true;
      state.user = payload?.data || payload;
    });

    builder.addCase(registerUser.rejected, (state, { payload }) => {
      state.isLoading = false;
      state.error = payload as string;
    });

    /* VERIFY OTP */

    builder.addCase(verifyOtpUser.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });

    builder.addCase(verifyOtpUser.fulfilled, (state, { payload }) => {
      console.log("User Payload:", payload?.user);

      state.isLoading = false;
      state.user = payload?.user || null;
      state.token = getToken();
    });

    builder.addCase(verifyOtpUser.rejected, (state, { payload }) => {
      state.isLoading = false;
      state.error = payload as string;
    });

    /* UPDATE PROFILE */

    builder.addCase(updateProfileThunk.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });

    builder.addCase(updateProfileThunk.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.user = payload;
    });

    builder.addCase(updateProfileThunk.rejected, (state, { payload }) => {
      state.isLoading = false;
      state.error = payload as string;
    });
  },
});

/* ---------------- EXPORTS ---------------- */

export const {
  logout,
  clearError,
  openLoginModal,
  closeLoginModal,
  setRedirectPath,
  clearRedirectPath,
} = authSlice.actions;
export default authSlice.reducer;