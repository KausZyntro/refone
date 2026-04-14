import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { cartAPI } from "@/services/api";
import type { AddToCartPayload, CartItem, CartState } from "@/types/cart";
import { parsePrice } from "@/utils/format";

// ── Thunk ─────────────────────────────────────────────────────────────────────
export const fetchCartSummary = createAsyncThunk(
    "cart/fetchCartSummary",
    async (userId: number | string, { rejectWithValue }) => {
        try {
            const response = await cartAPI.fetchCartSummary(userId);
            return response as { status: string; code: string; message: string; data: { cart_items: CartItem[], pricing: import("@/types/cart").CartPricing } };
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch cart summary"
            );
        }
    }
);

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

export const removeFromCart = createAsyncThunk(
    "cart/removeItem",
    async (cart_id: number, { rejectWithValue }) => {
        try {
            // const response = await cartAPI.removeItem(cart_id);
            // // console.log(cart_id);
            // return response as { status: string; code: string; message: string; data: { cart_id: number } };
            await cartAPI.removeItem(cart_id);

            return { cart_id }
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to remove item from cart"
            );
        }
    }
);

export const updateCartQuantityThunk = createAsyncThunk(
    "cart/updateCartQuantity",
    async ({ cart_id, action }: { cart_id: number; action: "increase" | "decrease" }, { rejectWithValue }) => {
        try {
            const response = await cartAPI.updateCartQuantity(cart_id, action);
            return { cart_id, action, response };
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to update quantity"
            );
        }
    }
);


// ── Local Storage Helpers ─────────────────────────────────────────────────────
const GUEST_CART_KEY = "guest_cart";

const getSavedCart = () => {
    if (typeof window === "undefined") return { items: [], totalQuantity: 0, pricing: null };
    const saved = localStorage.getItem(GUEST_CART_KEY);
    if (!saved) return { items: [], totalQuantity: 0, pricing: null };
    try {
        return JSON.parse(saved);
    } catch (e) {
        console.error("Error parsing saved cart", e);
        return { items: [], totalQuantity: 0, pricing: null };
    }
};

const saveCart = (state: CartState) => {
    if (typeof window === "undefined") return;
    localStorage.setItem(GUEST_CART_KEY, JSON.stringify({
        items: state.items,
        totalQuantity: state.totalQuantity,
        pricing: state.pricing
    }));
};

// ── Initial state ─────────────────────────────────────────────────────────────
const savedCart = getSavedCart();

const initialState: CartState = {
    items: savedCart.items,
    pricing: savedCart.pricing,
    totalQuantity: savedCart.totalQuantity,
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
        updateItemQuantity(state, action: import("@reduxjs/toolkit").PayloadAction<{ id: number; quantity: number }>) {
            const item = state.items.find(i => i.id === action.payload.id);
            if (item) {
                const diff = action.payload.quantity - Number(item.quantity);
                item.quantity = action.payload.quantity;

                const unitPrice = parsePrice(item.price?.selling_price);
                item.item_total = action.payload.quantity * unitPrice;
                state.totalQuantity += diff;

                if (state.pricing) {
                    state.pricing.subtotal = state.items.reduce((acc, curr) => acc + (curr.item_total || 0), 0);
                    state.pricing.grand_total = state.pricing.subtotal + state.pricing.delivery_charge + state.pricing.tax - state.pricing.discount;
                }
                saveCart(state);
            }
        },
        removeItem(state, action: import("@reduxjs/toolkit").PayloadAction<{ id: number }>) {
            const index = state.items.findIndex(i => i.id === action.payload.id);
            if (index !== -1) {
                const item = state.items[index];
                state.totalQuantity -= Number(item.quantity);
                state.items.splice(index, 1);

                if (state.pricing) {
                    state.pricing.subtotal = state.items.reduce((acc, curr) => acc + (curr.item_total || 0), 0);
                    state.pricing.grand_total = state.pricing.subtotal + state.pricing.delivery_charge + state.pricing.tax - state.pricing.discount;
                }
                saveCart(state);
            }
        },
        clearCart(state) {
            state.items = [];
            state.totalQuantity = 0;
            state.pricing = null;
            if (typeof window !== "undefined") {
                localStorage.removeItem(GUEST_CART_KEY);
            }
        },
        addLocalItem(state, action: import("@reduxjs/toolkit").PayloadAction<CartItem>) {
            const newItem = action.payload;
            const idx = state.items.findIndex(
                (i) => i.product_id === newItem.product_id && i.variant_id === newItem.variant_id
            );

            if (idx !== -1) {
                const existingQty = Number(state.items[idx].quantity) || 0;
                const newQty = Number(newItem.quantity) || 1;
                state.items[idx] = {
                    ...newItem,
                    quantity: String(existingQty + newQty)
                };
            } else {
                state.items.push(newItem);
            }

            // Sync total quantity
            state.totalQuantity = state.items.reduce(
                (total, item) => total + Number(item.quantity),
                0
            );

            // Sync pricing
            if (state.pricing) {
                state.pricing.subtotal = state.items.reduce((acc, curr) => {
                    const unitPrice = parsePrice(curr.price?.selling_price);
                    const itemTotal = Number(curr.quantity) * unitPrice;
                    return acc + itemTotal;
                }, 0);
                state.pricing.grand_total = state.pricing.subtotal + state.pricing.delivery_charge + state.pricing.tax - state.pricing.discount;
            } else {
                // Initialize pricing if null
                const subtotal = state.items.reduce((acc, curr) => {
                    const unitPrice = parsePrice(curr.price?.selling_price);
                    return acc + (Number(curr.quantity) * unitPrice);
                }, 0);
                state.pricing = {
                    subtotal,
                    delivery_charge: 0,
                    discount: 0,
                    tax: 0,
                    grand_total: subtotal
                };
            }
            saveCart(state);
        },
        increaseQuantity(state, action: import("@reduxjs/toolkit").PayloadAction<{ id: number }>) {
            const item = state.items.find(i => Number(i.id) === Number(action.payload.id));
            if (item) {
                const currentQty = Number(item.quantity) || 1;
                const newQty = currentQty + 1;
                item.quantity = newQty;

                const unitPrice = parsePrice(item.price?.selling_price);
                item.item_total = newQty * unitPrice;
                state.totalQuantity += 1;

                if (state.pricing) {
                    state.pricing.subtotal = state.items.reduce((acc, curr) => acc + (curr.item_total || 0), 0);
                    state.pricing.grand_total = state.pricing.subtotal + state.pricing.delivery_charge + state.pricing.tax - state.pricing.discount;
                }
                saveCart(state);
            }
        },
        decreaseQuantity(state, action: import("@reduxjs/toolkit").PayloadAction<{ id: number }>) {
            const item = state.items.find(i => Number(i.id) === Number(action.payload.id));
            if (item && Number(item.quantity) > 1) {
                const currentQty = Number(item.quantity) || 1;
                const newQty = currentQty - 1;
                item.quantity = newQty;

                const unitPrice = parsePrice(item.price?.selling_price);
                item.item_total = newQty * unitPrice;
                state.totalQuantity -= 1;

                if (state.pricing) {
                    state.pricing.subtotal = state.items.reduce((acc, curr) => acc + (curr.item_total || 0), 0);
                    state.pricing.grand_total = state.pricing.subtotal + state.pricing.delivery_charge + state.pricing.tax - state.pricing.discount;
                }
                saveCart(state);
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCartSummary.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchCartSummary.fulfilled, (state, { payload }) => {
                state.isLoading = false;
                const items = payload.data?.cart_items || [];
                state.items = items;
                state.pricing = payload.data?.pricing || null;
                state.totalQuantity = items.reduce(
                    (total, item) => total + Number(item.quantity),
                    0
                );
                // After fetching authenticated cart, we can clear guest cart
                if (typeof window !== "undefined") {
                    localStorage.removeItem(GUEST_CART_KEY);
                }
            })
            .addCase(fetchCartSummary.rejected, (state, { payload }) => {
                state.isLoading = false;
                state.error = payload as string;
            })
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
                    (i) => i.product_id === newItem.product_id && i.variant_id === newItem.variant_id
                );

                if (idx !== -1) {
                    // Update quantity instead of appending duplicate item
                    const existingQty = Number(state.items[idx].quantity) || 0;
                    const newQty = Number(newItem.quantity) || 1;
                    state.items[idx] = {
                        ...newItem,
                        quantity: String(existingQty + newQty)
                    };
                } else {
                    state.items.push(newItem);
                }

                // ✅ IMPORTANT: total quantity aur pricing update karo
                state.totalQuantity = state.items.reduce(
                    (total, item) => total + Number(item.quantity),
                    0
                );

                if (state.pricing) {
                    state.pricing.subtotal = state.items.reduce((acc, curr) => {
                        const unitPrice = parsePrice(curr.price?.selling_price);
                        const itemTotal = Number(curr.quantity) * unitPrice;
                        return acc + itemTotal;
                    }, 0);
                    state.pricing.grand_total = state.pricing.subtotal + state.pricing.delivery_charge + state.pricing.tax - state.pricing.discount;
                }

                state.successMessage = payload.message || "Item added to cart";
            })
            .addCase(addToCart.rejected, (state, { payload }) => {
                state.isLoading = false;
                state.error = payload as string;
            })
            .addCase(removeFromCart.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(removeFromCart.fulfilled, (state, { payload }) => {
                state.isLoading = false;

                const cartId = payload.cart_id;
                console.log(cartId)

                const index = state.items.findIndex(i => i.id === cartId);
                if (index !== -1) {
                    const item = state.items[index];
                    state.totalQuantity -= Number(item.quantity);
                    state.items.splice(index, 1);
                }

                if (state.pricing) {
                    state.pricing.subtotal = state.items.reduce(
                        (acc, curr) => acc + (curr.item_total || 0),
                        0
                    );
                    state.pricing.grand_total =
                        state.pricing.subtotal +
                        state.pricing.delivery_charge +
                        state.pricing.tax -
                        state.pricing.discount;
                }

                // state.successMessage = payload.message || "Item removed from cart";
            })
            .addCase(removeFromCart.rejected, (state, { payload }) => {
                state.isLoading = false;
                state.error = payload as string;
            })
            .addCase(updateCartQuantityThunk.pending, (state, { meta }) => {
                state.isLoading = true;
                state.error = null;
                
                // Optimistic Update
                const { cart_id, action } = meta.arg;
                const item = state.items.find((i) => Number(i.id) === Number(cart_id));
                if (item) {
                    const currentQty = Number(item.quantity) || 1;
                    const newQty = action === "increase" ? currentQty + 1 : (currentQty > 1 ? currentQty - 1 : currentQty);
                    
                    if (newQty !== currentQty) {
                        item.quantity = newQty;
                        const unitPrice = parsePrice(item.price?.selling_price);
                        item.item_total = newQty * unitPrice;
                        state.totalQuantity += (action === "increase" ? 1 : -1);

                        if (state.pricing) {
                            state.pricing.subtotal = state.items.reduce((acc, curr) => acc + (curr.item_total || 0), 0);
                            state.pricing.grand_total = state.pricing.subtotal + state.pricing.delivery_charge + state.pricing.tax - state.pricing.discount;
                        }
                    }
                }
            })
            .addCase(updateCartQuantityThunk.fulfilled, (state) => {
                state.isLoading = false;
            })
            .addCase(updateCartQuantityThunk.rejected, (state, { payload, meta }) => {
                state.isLoading = false;
                state.error = payload as string;
                
                // Rollback or Re-fetch? For now, we logic to revert could be complex.
                // It's better to re-fetch cart summary on error to ensure sync.
            });
    },
});

export const { clearCartMessage, updateItemQuantity, removeItem, clearCart, addLocalItem, increaseQuantity, decreaseQuantity } = cartSlice.actions;
export default cartSlice.reducer;
