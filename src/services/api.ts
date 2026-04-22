import axios from "axios";
import type { AddToCartPayload } from "@/types/cart";

// Using environment variable or fallback to a local API 
// const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api-auth.refones.com/api";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://refones.com/api-auth_v1/api";


const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    }
});

// Interceptor to add token to requests
api.interceptors.request.use((config) => {
    if (typeof window !== "undefined") {
        const authStore = localStorage.getItem("auth");
        let token = null;
        if (authStore) {
            try {
                const parsedAuth = JSON.parse(authStore);
                token = parsedAuth.token;
            } catch (e) {
                console.error("Error parsing auth token", e);
            }
        }

        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
            // config.headers.Authorization = token;
        }
        // console.log("REQUEST HEADERS:", config.headers);

    }
    return config;
});

export const authAPI = {
    login: async (identifier: string, password?: string) => {
        const payload: any = {};
        if (identifier.includes("@")) {
            payload.email = identifier;
        } else {
            payload.phone = identifier;
        }
        if (password) payload.password = password;
        const response = await api.post("/login", payload);
        // console.log("FULL RESPONSE:", response);
        return response.data;
    },
    register: async (data: { name: string; email: string; password: string; phone: string; role_id?: number }) => {
        const payload = { ...data, role_id: data.role_id || 3 };
        const response = await api.post("register", payload);
        // console.log("FULL RESPONSE:", response);
        return response.data;
    },
    verifyOTP: async (user_id: number, otp: string, device_name: string = "web") => {
        const response = await api.post("/verify-otp", { user_id, otp, device_name });
        // console.log("OTP VERIFY FULL RESPONSE:", response);
        return response.data;
    },
    forgotPassword: async (email: string) => {
        const response = await api.post("/forgot-password", { email });
        return response.data;
    },
    resetPassword: async (user_id: number, otp: string, new_password: string) => {
        const formData = new FormData();
        formData.append("user_id", user_id.toString());
        formData.append("otp", otp);
        formData.append("new_password", new_password);

        const response = await api.post("/reset-password", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    }

};

export const userAPI = {
    getUserProfile: async () => {
        const response = await api.get("/user-profile");
        // console.log(response?.data);
        return response.data;
    },
    updateProfile: async (data: { name: string; email: string; phone: string }) => {
        const response = await api.put("/profile/update", data);
        return response.data;
    }
};

export const productAPI = {
    getDashboardCampaigns: async () => {
        const response = await api.get("/products/dashboard-data");
        return response.data;
    },
    getProductById: async (productId: number | string) => {
        const response = await api.get(`/products/get-product-by-id?product_id=${productId}`);
        console.log("API RAW RESPONSE:", response.data);
        return response.data;
    },
    getFilters: async () => {
        const response = await api.get("/filter-list");
        return response.data;
    },
    getProducts: async (params: string = "", config: any = {}) => {
        const response = await api.get(`/product-list${params ? `?${params}` : ""}`, config);
        return response.data;
    },
}

export const addressAPI = {
    getAddresses: async (userId: number) => {
        const response = await api.get(`/addresses/${userId}`);
        return response.data;
    },
    addAddress: async (data: any) => {
        const response = await api.post(`/addresses/create`, data);
        return response.data;
    },
    updateAddress: async (id: number, data: any) => {
        const response = await api.put(`/addresses/update/${id}`, data);
        return response.data;
    },
    deleteAddress: async (id: number) => {
        const response = await api.delete(`/addresses/${id}`);
        return response.data;
    }
}

export const cartAPI = {
    addToCart: async (payload: AddToCartPayload) => {
        const response = await api.post("/cart/add", payload);
        return response.data;
    },
    fetchCartSummary: async (userId: number | string) => {
        const response = await api.post("/checkout/summary", { user_id: userId });
        return response.data;
    },
    removeItem: async (cart_id: number) => {
        const response = await api.delete("/cart/remove", {
            data: {
                cart_id: cart_id
            }
        });
        // console.log("REMOVE FROM CART RESPONSE:", response.data);
        return response.data;
    },
    updateCartQuantity: async (cart_id: number, action: "increase" | "decrease") => {
        const formData = new FormData();
        formData.append("cart_id", cart_id.toString());
        formData.append("action", action);
        const response = await api.patch("/cart/quantity", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    }
};

export const orderAPI = {
    createPaymentStatus: async (payload: FormData) => {
        const response = await api.patch("/checkout/payment-status", payload, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    },
    placeOrder: async (payload: FormData) => {
        const response = await api.put("/checkout/place-order", payload, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    }
};

export const exchangeAPI = {
    submitExchange: async (payload: any) => {
        const response = await api.post("/exchange/submit", payload);
        return response.data;
    },
};

export default api;