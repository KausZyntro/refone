export interface PlaceOrderPayload {
    user_id: number;
    address_id: number;
    payment_method: string;
    // Add other fields as required by the backend API
}

export interface OrderState {
    isLoading: boolean;
    error: string | null;
    success: boolean;
    currentOrderId: number | string | null;
}
