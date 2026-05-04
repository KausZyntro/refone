import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { orderAPI } from "@/services/api";
import type { OrderState } from "@/types/order";

export interface PaymentStatusPayload {
    pmt_order_id: string;
    payment_status: string;
    payment_method: string;
    amount: number;
}

export interface PlaceOrderPayload {
    customer_id: number;
    variant_id: number;
    product_id: number;
    quantity: number;
    address_id: number;
    order_id: string;
    pymt_id: number;
}

export const createPaymentStatus = createAsyncThunk(
    "order/createPaymentStatus",
    async (payload: PaymentStatusPayload, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            formData.append("pmt_order_id", payload.pmt_order_id);
            formData.append("payment_status", payload.payment_status);
            formData.append("payment_method", payload.payment_method);
            formData.append("amount", payload.amount.toString());

            const response = await orderAPI.createPaymentStatus(formData);
            return response.payment || response.data || response; // Return the payment object which contains id
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to create payment status"
            );
        }
    }
);

export const placeOrder = createAsyncThunk(
    "order/placeOrder",
    async (payload: PlaceOrderPayload, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            formData.append("customer_id", payload.customer_id.toString());
            formData.append("variant_id", payload.variant_id.toString());
            formData.append("product_id", payload.product_id.toString());
            formData.append("quantity", payload.quantity.toString());
            formData.append("address_id", payload.address_id.toString());
            formData.append("order_id", payload.order_id);
            formData.append("pymt_id", payload.pymt_id.toString());

            const response = await orderAPI.placeOrder(formData);
            return response.data; // assuming { success: true, data: { order_id: 123 } }
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to place order"
            );
        }
    }
);

export const fetchOrderList = createAsyncThunk(
    "order/fetchOrderList",
    async (customer_id: number, { rejectWithValue }) => {
        try {
            const response = await orderAPI.fetchOrderList(customer_id);
            return response.data; // The array of orders
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch orders"
            );
        }
    }
);

const initialState: OrderState & { isProcessingPayment: boolean; orders: any[] } = {
    isLoading: false,
    isProcessingPayment: false,
    error: null,
    success: false,
    currentOrderId: null,
    orders: [],
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
            .addCase(createPaymentStatus.pending, (state) => {
                state.isProcessingPayment = true;
                state.error = null;
                state.success = false;
            })
            .addCase(createPaymentStatus.fulfilled, (state) => {
                state.isProcessingPayment = false;
                // Don't set success yet until placeOrder completes
            })
            .addCase(createPaymentStatus.rejected, (state, action) => {
                state.isProcessingPayment = false;
                state.error = action.payload as string;
                state.success = false;
            })
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
            })
            .addCase(fetchOrderList.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchOrderList.fulfilled, (state, action) => {
                state.isLoading = false;
                state.orders = action.payload || [];
            })
            .addCase(fetchOrderList.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    }
});

export const { resetOrderState } = orderSlice.actions;
export default orderSlice.reducer;
