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

interface ExchangeState {
    products: any[];
    questions: any[];
    isLoading: boolean;
    isLoadingQuestions: boolean;
    error: string | null;
    successData: any | null;
}

const initialState: ExchangeState = {
    products: [],
    questions: [],
    isLoading: false,
    isLoadingQuestions: false,
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
            });
    },
});

export const { resetExchangeState } = exchangeSlice.actions;
export default exchangeSlice.reducer;
