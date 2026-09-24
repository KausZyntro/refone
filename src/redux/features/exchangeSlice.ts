import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { exchangeAPI } from "@/services/api";

export const submitExchangeRequest = createAsyncThunk(
    "exchange/submitExchange",
    async (payload: any, { rejectWithValue }) => {
        try {
            const response = await exchangeAPI.submitExchange(payload);
            if (response.status === "success") {
                return response;
            } else {
                return rejectWithValue(response.message || "Failed to submit exchange");
            }
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || error.message || "An error occurred");
        }
    }
);

export const submitDeviceBuybackRequest = createAsyncThunk(
    "exchange/submitDeviceBuyback",
    async (payload: any, { rejectWithValue }) => {
        try {
            const response = await exchangeAPI.submitDeviceBuyback(payload);
            if (response.success === true || response.status === "success") {
                return response.data;
            } else {
                return rejectWithValue(response.message || "Failed to submit device buyback");
            }
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || error.message || "An error occurred");
        }
    }
);

export const submitBuybackAssessmentRequest = createAsyncThunk(
    "exchange/submitBuybackAssessment",
    async (payload: FormData, { rejectWithValue }) => {
        try {
            const response = await exchangeAPI.submitBuybackAssessment(payload);
            // Relaxing condition: as long as it doesn't throw, we consider it successful
            if (response) {
                return response.data || response;
            } else {
                return rejectWithValue(response?.message || "Failed to submit buyback assessment");
            }
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || error.message || "An error occurred");
        }
    }
);

export const submitBuybackAssessmentStepRequest = createAsyncThunk(
    "exchange/submitBuybackAssessmentStep",
    async ({ assessmentId, payload }: { assessmentId: string | number; payload: any }, { rejectWithValue }) => {
        try {
            const response = await exchangeAPI.submitBuybackAssessmentStep(assessmentId, payload);
            if (response && response.status !== false) {
                return response.data || response;
            } else {
                return rejectWithValue(response?.message || "Failed to submit buyback assessment step");
            }
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || error.message || "An error occurred");
        }
    }
);

export const fetchPriceBreakdown = createAsyncThunk(
    "exchange/fetchPriceBreakdown",
    async (assessmentId: string | number, { rejectWithValue }) => {
        try {
            const response = await exchangeAPI.getPriceBreakdown(assessmentId);
            const actualResponse = Array.isArray(response) ? response[0] : response;
            if (actualResponse && actualResponse.status !== false) {
                return actualResponse.data;
            } else {
                return rejectWithValue(actualResponse?.message || "Failed to fetch price breakdown");
            }
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || error.message || "An error occurred");
        }
    }
);

export const fetchExchangeProducts = createAsyncThunk(
  "exchange/fetchProducts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await exchangeAPI.getProductList();

      if (response.status === "success") {
        return response.data;
      } else {
        return rejectWithValue(
          response.message || "Failed to fetch products"
        );
      }
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
        error.message ||
        "Something went wrong"
      );
    }
  }
);

export const fetchBuybackQuestions = createAsyncThunk(
  "exchange/fetchBuybackQuestions",
  async (index: number, { rejectWithValue }) => {
    try {
      const response = await exchangeAPI.getBuybackQuestions(index);
      if (response.status === true) {
        return response.data;
      } else {
        return rejectWithValue(response.message || "Failed to fetch questions");
      }
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
        error.message ||
        "Something went wrong"
      );
    }
  }
);

export const fetchDeviceOptions = createAsyncThunk(
  "exchange/fetchDeviceOptions",
  async (params: { brand_id: number | string; product_id: number | string; color: string; storage: string }, { rejectWithValue }) => {
    try {
      const data = await exchangeAPI.getDeviceOptions(params);
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
        error.message ||
        "Something went wrong"
      );
    }
  }
);

interface ExchangeState {
    products: any[];
    questions: any[];
    deviceOptions: any | null;
    isLoading: boolean;
    isLoadingQuestions: boolean;
    isLoadingDeviceOptions: boolean;
    isLoadingPriceBreakdown: boolean;
    priceBreakdownData: any | null;
    error: string | null;
    successData: any | null;
}

const initialState: ExchangeState = {
    products: [],
    questions: [],
    deviceOptions: null,
    isLoading: false,
    isLoadingQuestions: false,
    isLoadingDeviceOptions: false,
    isLoadingPriceBreakdown: false,
    priceBreakdownData: null,
    error: null,
    successData: null,
};

const exchangeSlice = createSlice({
    name: "exchange",
    initialState,
    reducers: {
        resetExchangeState: (state) => {
            state.isLoading = false;
            state.error = null;
            state.successData = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(submitExchangeRequest.pending, (state) => {
                state.isLoading = true;
                state.error = null;
                state.successData = null;
            })
            .addCase(submitExchangeRequest.fulfilled, (state, action) => {
                state.isLoading = false;
                state.successData = action.payload;
                state.error = null;
            })
            .addCase(submitExchangeRequest.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
                state.successData = null;
            })
            .addCase(fetchExchangeProducts.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchExchangeProducts.fulfilled, (state, action) => {
                state.isLoading = false;
                state.products = action.payload;
                state.error = null;
            })
            .addCase(fetchExchangeProducts.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            .addCase(fetchBuybackQuestions.pending, (state) => {
                state.isLoadingQuestions = true;
                state.error = null;
            })
            .addCase(fetchBuybackQuestions.fulfilled, (state, action) => {
                state.isLoadingQuestions = false;
                state.questions = action.payload;
                state.error = null;
            })
            .addCase(fetchBuybackQuestions.rejected, (state, action) => {
                state.isLoadingQuestions = false;
                state.error = action.payload as string;
            })
            .addCase(submitDeviceBuybackRequest.pending, (state) => {
                state.isLoading = true;
                state.error = null;
                state.successData = null;
            })
            .addCase(submitDeviceBuybackRequest.fulfilled, (state, action) => {
                state.isLoading = false;
                state.successData = action.payload;
                state.error = null;
            })
            .addCase(submitDeviceBuybackRequest.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
                state.successData = null;
            })
            .addCase(submitBuybackAssessmentRequest.pending, (state) => {
                state.isLoading = true;
                state.error = null;
                state.successData = null;
            })
            .addCase(submitBuybackAssessmentRequest.fulfilled, (state, action) => {
                state.isLoading = false;
                state.successData = action.payload;
                state.error = null;
            })
            .addCase(submitBuybackAssessmentRequest.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
                state.successData = null;
            })
            .addCase(submitBuybackAssessmentStepRequest.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(submitBuybackAssessmentStepRequest.fulfilled, (state) => {
                state.isLoading = false;
                state.error = null;
            })
            .addCase(submitBuybackAssessmentStepRequest.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            .addCase(fetchDeviceOptions.pending, (state) => {
                state.isLoadingDeviceOptions = true;
                state.error = null;
            })
            .addCase(fetchDeviceOptions.fulfilled, (state, action) => {
                state.isLoadingDeviceOptions = false;
                state.deviceOptions = action.payload;
                state.error = null;
            })
            .addCase(fetchDeviceOptions.rejected, (state, action) => {
                state.isLoadingDeviceOptions = false;
                state.error = action.payload as string;
            })
            .addCase(fetchPriceBreakdown.pending, (state) => {
                state.isLoadingPriceBreakdown = true;
                state.error = null;
            })
            .addCase(fetchPriceBreakdown.fulfilled, (state, action) => {
                state.isLoadingPriceBreakdown = false;
                state.priceBreakdownData = action.payload;
                state.error = null;
            })
            .addCase(fetchPriceBreakdown.rejected, (state, action) => {
                state.isLoadingPriceBreakdown = false;
                state.error = action.payload as string;
            });
    },
});

export const { resetExchangeState } = exchangeSlice.actions;
export default exchangeSlice.reducer;
