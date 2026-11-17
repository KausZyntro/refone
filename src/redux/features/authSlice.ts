import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authAPI, userAPI } from "@/services/api";

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

/* ---------------- USER HELPERS ---------------- */

// API responses wrap the user differently (user, data.user, data). Normalise
// them to a single object and make sure an id always exists.
const normalizeUser = (raw: any) => {
  if (!raw) return null;

  const source = raw.user || raw.data?.user || raw.data || raw;
  if (!source || typeof source !== "object") return null;

  const id = source.id ?? source.userId ?? source.user_id;
  return { ...source, ...(id != null ? { id } : {}) };
};

const persistUser = (user: any) => {
  if (typeof window === "undefined" || !user) return;

  try {
    const auth = localStorage.getItem("auth");
    if (!auth) return;

    const parsedAuth = JSON.parse(auth);
    localStorage.setItem("auth", JSON.stringify({ ...parsedAuth, user }));
  } catch (error) {
    console.error("Failed to persist user", error);
  }
};

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

export const googleLoginUser = createAsyncThunk(
  "auth/googleLogin",
  async (_, { rejectWithValue }) => {
    try {

      const response = await authAPI.googleLogin();
      return response;
    } catch (error: any) {

      return rejectWithValue(
        error.response?.data?.message ||
        "Google login failed"
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
      const maxTime = response?.data?.refreshTime || "24";
      const hour = parseInt(maxTime);
      const maxTimeInSeconds = hour * 60 * 60;

      return {
        ...(response.data || response),
        maxTimeInSeconds
      };
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
        // The API may answer with the updated user, a partial object or no data
        // at all. Fall back to the values that were just sent so the name never
        // disappears from the header.
        const raw =
          response.data && typeof response.data === "object"
            ? response.data.user || response.data
            : {};

        return { ...userData, ...raw };
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
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: getUser(),
  token: getToken(),
  isLoading: false,
  error: null,
  registerSuccess: false,
  isLoginModalOpen: false,
  redirectPath: null,
  isAuthenticated: !!getToken(),
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
      const normalizedUser = normalizeUser(payload);
      // A login response that only carries the OTP challenge must not wipe the
      // profile that is already in the store.
      if (normalizedUser && (normalizedUser.name || normalizedUser.email || normalizedUser.phone || normalizedUser.mobile)) {
        state.user = normalizedUser;
      }
      state.token = getToken();
    });

    builder.addCase(loginUser.rejected, (state, { payload }) => {
      state.isLoading = false;
      state.error = payload as string;
    });

    builder.addCase(googleLoginUser.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });

    builder.addCase(googleLoginUser.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      // Robust extraction of user and token
      const rawUser = normalizeUser(payload);
      const token = payload?.token || payload?.data?.token;
      
      const refreshTime = payload?.refreshTime || payload?.data?.refreshTime || "24";
      const hour = parseInt(refreshTime);
      const maxTimeInSeconds = hour * 60 * 60;

      if (token && rawUser) {
        const user = rawUser;

        if (typeof window !== "undefined") {
          document.cookie = `token=${token}; path=/; max-age=${maxTimeInSeconds}; SameSite=Lax; Secure`;
          const expiry = Date.now() + maxTimeInSeconds * 1000;

          localStorage.setItem(
            "auth",
            JSON.stringify({
              token,
              user,
              expiry,
            })
          );
        }
        state.user = user;
        state.token = token;
        state.isAuthenticated = true;
      }
    });

    builder.addCase(googleLoginUser.rejected, (state, { payload }) => {
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
      state.isLoading = false;
      const rawUser = normalizeUser(payload?.user || payload?.data?.user || payload);
      const token = payload?.token || payload?.data?.token;
      const maxTimeInSeconds = payload?.maxTimeInSeconds || 24 * 60 * 60;
      
      if (token && rawUser) {
        const user = rawUser;
        
        if (typeof window !== "undefined") {
          document.cookie = `token=${token}; path=/; max-age=${maxTimeInSeconds}; SameSite=Lax; Secure`;
          const expiry = Date.now() + maxTimeInSeconds * 1000;

          localStorage.setItem(
            "auth",
            JSON.stringify({
              token,
              user,
              expiry,
            })
          );
        }
        state.user = user;
        state.token = token;
        state.isAuthenticated = true;
      }
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

      const updated = normalizeUser(payload);
      const user = updated ? { ...(state.user || {}), ...updated } : state.user;

      state.user = user;
      persistUser(user);
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