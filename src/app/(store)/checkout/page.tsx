"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchCartSummary } from "@/redux/features/cartSlice";
import AddressSelector from "@/components/checkout/AddressSelector";
import CheckoutSummary from "@/components/checkout/CheckoutSummary";
import { FiLock } from "react-icons/fi";
import "./checkout.css";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();

    const [mounted, setMounted] = useState(false);
    const { user } = useSelector((state: RootState) => state.auth);
    const { items, isLoading, error } = useSelector((state: RootState) => state.cart);

    useEffect(() => {
        setMounted(true);
        if (user?.id) {
            dispatch(fetchCartSummary(user.id));
        } else if (!user) {
            // Uncomment if you want strict route protection inside component
            // router.push("/login");
        }
    }, [dispatch, user]);

    if (!mounted) {
        return (
            <div className="checkout-page-wrapper loading">
                <div className="checkout-container">
                    <div className="skeleton-line title" />
                    <div className="checkout-layout">
                        <div className="checkout-left">
                            <div className="skeleton-card large" />
                        </div>
                        <div className="checkout-right">
                            <div className="skeleton-card summary" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (isLoading && items.length === 0) {
        return (
            <div className="checkout-page-wrapper loading">
                <div className="checkout-container">
                    <div className="skeleton-line title" />
                    <div className="checkout-layout">
                        <div className="checkout-left">
                            <div className="skeleton-card large" />
                        </div>
                        <div className="checkout-right">
                            <div className="skeleton-card summary" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!isLoading && items.length === 0) {
        return (
            <div className="checkout-page-wrapper empty">
                <div className="checkout-container text-center">
                    <h2>Cannot proceed to checkout</h2>
                    <p>Your cart is empty.</p>
                    <button onClick={() => router.push("/")} className="btn-return">
                        Return to Shop
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="checkout-page-wrapper">
            <div className="checkout-container">

                <div className="checkout-header-main">
                    <h1>Checkout</h1>
                    <div className="secure-badge">
                        <FiLock /> Secure
                    </div>
                </div>

                <div className="checkout-layout">
                    {/* Left Panel: Address Selection */}
                    <div className="checkout-left">
                        <AddressSelector />
                    </div>

                    {/* Right Panel: Order Summary & Place Order */}
                    <div className="checkout-right">
                        <CheckoutSummary />
                    </div>
                </div>
            </div>
        </div>
    );
}
