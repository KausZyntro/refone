// ── Request payload ──────────────────────────────────────────────────────────
// export interface AddToCartPayload {
//     customer_id: number;
//     product_id: number;
//     variant_id: number;
//     quantity: number;
//     price_id: number;
// }
export interface AddToCartPayload {
    user_id: number;
    product_id: number;
    variant_id: number;
    quantity: number;
}

// ── API response shape ───────────────────────────────────────────────────────
export interface CartProduct {
    id: number;
    name: string;
}

export interface CartItem {
    id: number;
    customer_id: number;
    product_id: number;
    variant_id: number;
    quantity: string;
    price_id: number;
    address_id: number;
    order_id: string;
    product: CartProduct;
}

export interface AddToCartResponse {
    status: string;
    code: string;
    message: string;
    data: CartItem;
}

// ── Redux state ──────────────────────────────────────────────────────────────
export interface CartState {
    items: CartItem[];
    totalQuantity: number;
    isLoading: boolean;
    error: string | null;
    successMessage: string | null;
}
