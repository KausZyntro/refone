/**
 * Razorpay Service
 * Handles loading the Razorpay SDK and providing a clean interface for payment initialization.
 */

import { RazorpayOptions } from "@/types/razorpay";

export const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
        if (typeof window === "undefined") {
            resolve(false);
            return;
        }

        // Check if already loaded
        if ((window as any).Razorpay) {
            resolve(true);
            return;
        }

        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        script.onload = () => resolve(true);
        script.onerror = () => {
            console.error("Razorpay SDK failed to load.");
            resolve(false);
        };
        document.body.appendChild(script);
    });
};

export const initializeRazorpay = (options: RazorpayOptions) => {
    if (typeof window !== "undefined" && (window as any).Razorpay) {
        const rzp = new (window as any).Razorpay(options);
        rzp.open();
        return rzp;
    }
    console.error("Razorpay SDK not loaded.");
    return null;
};
