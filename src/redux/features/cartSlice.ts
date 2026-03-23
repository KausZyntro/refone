import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { cartAPI } from "@/services/api";
import type { AddToCartPayload, CartItem, CartState } from "@/types/cart";

// ── Thunk ─────────────────────────────────────────────────────────────────────
export const addToCart = createAsyncThunk(
    "cart/addToCart",
    async (payload: AddToCartPayload, { rejectWithValue }) => {
        try {
            const response = await cartAPI.addToCart(payload);
            // API envelope: { status, code, message, data: CartItem }
            return response as { status: string; code: string; message: string; data: CartItem };
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to add item to cart"
            );
        }
    }
);

// ── Initial state ─────────────────────────────────────────────────────────────
const initialState: CartState = {
    items: [],
    totalQuantity: 0,
    isLoading: false,
    error: null,
    successMessage: null,
};

// ── Slice ─────────────────────────────────────────────────────────────────────
const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        /** Call this after the toast has been shown to reset both message fields. */
        clearCartMessage(state) {
            state.successMessage = null;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(addToCart.pending, (state) => {
                state.isLoading = true;
                state.error = null;
                state.successMessage = null;
            })
            // .addCase(addToCart.fulfilled, (state, { payload }) => {
            //     state.isLoading = false;
            //     const idx = state.items.findIndex((i) => i.id === payload.data.id);
            //     if (idx !== -1) {
            //         state.items[idx] = payload.data;
            //     } else {
            //         state.items.push(payload.data);
            //     }
            //     state.successMessage = payload.message || "Item added to cart";
            // })
            .addCase(addToCart.fulfilled, (state, { payload }) => {
            state.isLoading = false;

            const newItem = payload.data;

            const idx = state.items.findIndex(
                (i) => i.product_id === newItem.product_id
            );

            if (idx !== -1) {
                state.items[idx] = newItem;
            } else {
                state.items.push(newItem);
            }

            // ✅ IMPORTANT: total quantity update karo
            state.totalQuantity = state.items.reduce(
                (total, item) => total + Number(item.quantity),
                0
            );

            state.successMessage = payload.message || "Item added to cart";
            })
            .addCase(addToCart.rejected, (state, { payload }) => {
                state.isLoading = false;
                state.error = payload as string;
            });
    },
});

export const { clearCartMessage } = cartSlice.actions;
export default cartSlice.reducer;
