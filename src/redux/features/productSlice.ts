import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { productAPI } from "@/services/api";

// ── Thunk ──────────────────────────────────────────────────────────────────
export const fetchProductById = createAsyncThunk(
    "product/fetchById",
    async (productId: number | string, { rejectWithValue }) => {
        try {
            // service returns response.data  →  { status, code, data: {...}, ... }
            const response = await productAPI.getProductById(productId);
            return response; // fulfilled gets the full envelope
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch product",
            );
        }
    },
);

// ── Types ──────────────────────────────────────────────────────────────────
interface ProductState {
    product: any | null;
    isLoading: boolean;
    error: string | null;
}

const initialState: ProductState = {
    product: null,
    isLoading: false,
    error: null,
};

// ── Slice ──────────────────────────────────────────────────────────────────
const productSlice = createSlice({
    name: "product",
    initialState,
    reducers: {
        clearProduct(state) {
            state.product = null;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProductById.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchProductById.fulfilled, (state, action) => {
                state.isLoading = false;
                // API envelope: { status, code, data: { ...product } }
                state.product = action.payload?.data ?? null;
            })
            .addCase(fetchProductById.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearProduct } = productSlice.actions;
export default productSlice.reducer;
