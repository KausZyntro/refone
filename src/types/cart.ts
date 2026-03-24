// ── Request payload ──────────────────────────────────────────────────────────
export interface AddToCartPayload {
    user_id: number;
    product_id: number;
    variant_id: number;
    quantity: number;
}

// ── API response shape ───────────────────────────────────────────────────────
export interface CartProduct {
    name: string;
    image?: string;
}

export interface CartImage {
    id: number;
    variant_id: number;
    image_url: string;
    thumbnail_url?: string;
    is_primary?: number;
}

export interface CartVariant {
    id?: number;
    storage: string;
    color: string;
    inventory?: {
        available_stock: number;
    };
    images?: CartImage[];
}

export interface CartPrice {
    selling_price: string;
}

export interface CartItem {
    id: number;
    customer_id?: number | null;
    product_id: number;
    variant_id: number;
    quantity: number | string;
    item_total: number;
    product: CartProduct;
    variant: CartVariant[];
    price: CartPrice;
}

export interface CartPricing {
    subtotal: number;
    delivery_charge: number;
    discount: number;
    tax: number;
    grand_total: number;
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
    pricing: CartPricing | null;
    totalQuantity: number;
    isLoading: boolean;
    error: string | null;
    successMessage: string | null;
}
