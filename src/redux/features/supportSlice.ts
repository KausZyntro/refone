import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { supportAPI } from "@/services/api";

export const submitSupportRequest = createAsyncThunk(
    "support/submitSupport",
    async (payload: any, { rejectWithValue }) => {
        try {
            const response = await supportAPI.submitSupportTicket(payload);
            if (response.status === "success") {
                return response;
            } else {
                return rejectWithValue(response.message || "Failed to submit support ticket");
            }
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || error.message || "An error occurred");
        }
    }
);

interface SupportState {
    isLoading: boolean;
    error: string | null;
    successData: any | null;
}

const initialState: SupportState = {
    isLoading: false,
    error: null,
    successData: null,
};

const supportSlice = createSlice({
    name: "support",
    initialState,
    reducers: {
        resetSupportState: (state) => {
            state.isLoading = false;
            state.error = null;
            state.successData = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(submitSupportRequest.pending, (state) => {
                state.isLoading = true;
                state.error = null;
                state.successData = null;
            })
            .addCase(submitSupportRequest.fulfilled, (state, action) => {
                state.isLoading = false;
                state.successData = action.payload;
                state.error = null;
            })
            .addCase(submitSupportRequest.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
                state.successData = null;
            });
    },
});

export const { resetSupportState } = supportSlice.actions;
export default supportSlice.reducer;
