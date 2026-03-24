import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { orderAPI } from "@/services/api";
import type { OrderState, PlaceOrderPayload } from "@/types/order";

export const placeOrder = createAsyncThunk(
    "order/placeOrder",
    async (payload: PlaceOrderPayload, { rejectWithValue }) => {
        try {
            const response = await orderAPI.placeOrder(payload);
            return response.data; // assuming { success: true, data: { order_id: 123 } }
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to place order"
            );
        }
    }
);

const initialState: OrderState = {
    isLoading: false,
    error: null,
    success: false,
    currentOrderId: null,
};

const orderSlice = createSlice({
    name: "order",
    initialState,
    reducers: {
        resetOrderState: (state) => {
            state.isLoading = false;
            state.error = null;
            state.success = false;
            state.currentOrderId = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(placeOrder.pending, (state) => {
                state.isLoading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(placeOrder.fulfilled, (state, action) => {
                state.isLoading = false;
                state.success = true;
                state.currentOrderId = action.payload?.order_id || null;
            })
            .addCase(placeOrder.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
                state.success = false;
            });
    }
});

export const { resetOrderState } = orderSlice.actions;
export default orderSlice.reducer;
