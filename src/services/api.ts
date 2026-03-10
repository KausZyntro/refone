import axios from "axios";

// Using environment variable or fallback to a local API 
const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api-auth.refones.com/api";

const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    }
});

// Interceptor to add token to requests
api.interceptors.request.use((config) => {
    if (typeof window !== "undefined") {
        const token = localStorage.getItem("token");
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

export const authAPI = {
    login: async (email: string, password: string) => {
        const response = await api.post("/login", { email, password });
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
    }
    
};

export default api;