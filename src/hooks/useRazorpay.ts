"use client";

import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { createPaymentStatus, placeOrder } from "@/redux/features/orderSlice";
import { clearCart } from "@/redux/features/cartSlice";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { loadRazorpayScript, initializeRazorpay } from "@/services/razorpayService";
import { RazorpayOptions, RazorpayResponse } from "@/types/razorpay";

interface UseRazorpayProps {
    amount: number;
    items: any[];
    addressId: number | null;
}

export const useRazorpay = ({ amount, items, addressId }: UseRazorpayProps) => {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const { user } = useSelector((state: RootState) => state.auth);

    const initiatePayment = useCallback(async () => {
        if (!user?.id || !addressId) {
            toast.error("User or address information missing.");
            return;
        }

        if (items.length === 0) {
            toast.error("Your cart is empty.");
            return;
        }

        const isLoaded = await loadRazorpayScript();
        if (!isLoaded) {
            toast.error("Razorpay SDK failed to load. Please check your internet connection.");
            return;
        }

        const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

        if (!razorpayKey) {
            console.error("Razorpay Key ID is missing in environment variables.");
            toast.error("Payment configuration error. Please contact support.");
            return;
        }

        const options: RazorpayOptions = {
            key: razorpayKey,
            amount: Math.round(amount * 100), // Amount in paise
            currency: "INR",
            name: "Refone",
            description: "Order Payment",
            prefill: {
                name: user.name || "",
                email: user.email || "",
                contact: user.phone || "",
            },
            theme: {
                color: "#006aaf", // Refone branding color
            },
            handler: async (response: RazorpayResponse) => {
                try {
                    // 1. Create Payment Status in Backend
                    // pmt_order_id is usually the razorpay_payment_id or razorpay_order_id
                    const pmtRes = await dispatch(
                        createPaymentStatus({
                            pmt_order_id: response.razorpay_order_id || response.razorpay_payment_id || "pmt_" + Date.now(),
                            payment_status: "success",
                            payment_method: "online",
                            amount: amount,
                        })
                    ).unwrap();

                    const pymt_id = pmtRes.id;

                    // 2. Place Order(s) in Backend
                    // Loop through all items in the cart to place individual orders if the backend requires it.
                    // If the backend supported a bulk order, we would send the array here.
                    const orderPromises = items.map(item => 
                        dispatch(
                            placeOrder({
                                customer_id: Number(user.id),
                                variant_id: Number(item.variant_id) || 0,
                                product_id: Number(item.product_id) || 0,
                                quantity: Number(item.quantity) || 1,
                                address_id: addressId,
                                order_id: response.razorpay_order_id || response.razorpay_payment_id || "ord_" + Date.now(),
                                pymt_id: pymt_id,
                            })
                        ).unwrap()
                    );

                    await Promise.all(orderPromises);

                    toast.success("Order(s) placed successfully!");
                    
                    // Clear cart and redirect
                    dispatch(clearCart());
                    router.push("/order-success");
                } catch (error: any) {
                    console.error("Order process failed:", error);
                    toast.error(error || "Payment successful, but order placement failed. Please contact support.");
                }
            },
            modal: {
                ondismiss: () => {
                    toast.info("Payment cancelled.");
                },
            },
        };

        initializeRazorpay(options);
    }, [user, addressId, amount, items, dispatch, router]);

    return { initiatePayment };
};
