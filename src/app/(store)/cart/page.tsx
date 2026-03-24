"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchCartSummary } from "@/redux/features/cartSlice";
import CartItemCard from "@/components/cart/CartItemCard";
import CartSummary from "@/components/cart/CartSummary";
import { FiShoppingBag } from "react-icons/fi";
import Link from "next/link";
import { useRouter } from "next/navigation";
import "../cart/cart.css";

export default function CartPage() {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();

    const { items, isLoading, error } = useSelector((state: RootState) => state.cart);
    const { user } = useSelector((state: RootState) => state.auth);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (user?.id) {
            dispatch(fetchCartSummary(user.id));
        }
    }, [dispatch, user?.id]);

    // Prevent hydration errors by not rendering differences until mounted
    if (!mounted) {
        return (
            <div className="cart-container cart-loading">
                <div className="skeleton-title" />
                <div className="cart-layout">
                    <div className="cart-items-list">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="skeleton-card" />
                        ))}
                    </div>
                    <div className="cart-sidebar">
                        <div className="skeleton-summary" />
                    </div>
                </div>
            </div>
        );
    }

    if (isLoading && items.length === 0) {
        return (
            <div className="cart-container cart-loading">
                <div className="skeleton-title" />
                <div className="cart-layout">
                    <div className="cart-items-list">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="skeleton-card" />
                        ))}
                    </div>
                    <div className="cart-sidebar">
                        <div className="skeleton-summary" />
                    </div>
                </div>
            </div>
        );
    }

    if (!isLoading && items.length === 0) {
        return (
            <div className="cart-empty-state">
                <div className="cart-empty-icon">
                    <FiShoppingBag size={48} />
                </div>
                <h2>Your cart is empty</h2>
                <p>
                    Looks like you have not added anything to your cart yet. Browse our top products and discover the best deals!
                </p>
                <Link href="/" className="btn-start-shopping">
                    Start Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="cart-page-wrapper">
            <div className="cart-container">
                <div className="cart-header">
                    <h1>Shopping Cart</h1>
                    <p>
                        You have {items.length} {items.length === 1 ? "item" : "items"} in your cart.
                    </p>
                </div>

                <div className="cart-layout">
                    <div className="cart-items-list">
                        {items.map((item) => (
                            <CartItemCard key={item.id} item={item} />
                        ))}
                    </div>

                    <div className="cart-sidebar">
                        <CartSummary />
                    </div>
                </div>
            </div>
        </div>
    );
}
