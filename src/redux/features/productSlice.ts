import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { productAPI } from "@/services/api";

// ── Thunks ──────────────────────────────────────────────────────────────────
export const fetchProductById = createAsyncThunk(
    "product/fetchById",
    async (productId: number | string, { rejectWithValue }) => {
        try {
            const response = await productAPI.getProductById(productId);
            return response;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch product",
            );
        }
    },
);

export const fetchProducts = createAsyncThunk(
    "product/fetchProducts",
    async (params: string, { rejectWithValue }) => {
        try {
            const response = await productAPI.getProducts(params);
            return response;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch products",
            );
        }
    },
);

export const fetchFilters = createAsyncThunk(
    "product/fetchFilters",
    async (_, { rejectWithValue }) => {
        try {
            const response = await productAPI.getFilters();
            return response;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch filters",
            );
        }
    },
);

// ── Types ──────────────────────────────────────────────────────────────────
interface ProductState {
    product: any | null; // For single product detail
    products: any[]; // For listing
    pagination: {
        current_page: number;
        last_page: number;
        total: number;
    } | null;
    filters: any | null; // Available filter options from API
    isLoading: boolean;
    isProductsLoading: boolean;
    error: string | null;
}

const initialState: ProductState = {
    product: null,
    products: [],
    pagination: null,
    filters: null,
    isLoading: false,
    isProductsLoading: false,
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
            // Single Product
            .addCase(fetchProductById.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchProductById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.product = action.payload?.data ?? action.payload ?? null;
            })
            .addCase(fetchProductById.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // Product List
            .addCase(fetchProducts.pending, (state) => {
                state.isProductsLoading = true;
                state.error = null;
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.isProductsLoading = false;
                // The API structure is { status, code, data: { current_page, data: [...], ... } }
                const responseData = action.payload?.data;

                if (responseData && Array.isArray(responseData.data)) {
                    state.products = responseData.data;
                    state.pagination = {
                        current_page: responseData.current_page ?? 1,
                        last_page: responseData.last_page ?? 1,
                        total: responseData.total ?? 0,
                    };
                } else if (Array.isArray(action.payload?.data)) {
                    // Fallback for non-paginated or different structure
                    state.products = action.payload.data;
                    state.pagination = null;
                } else {
                    state.products = [];
                    state.pagination = null;
                }
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.isProductsLoading = false;
                state.error = action.payload as string;
            })
            // Filter List
            .addCase(fetchFilters.fulfilled, (state, action) => {
                state.filters = action.payload?.filters ?? null;
            });
    },
});

export const { clearProduct } = productSlice.actions;
export default productSlice.reducer;
