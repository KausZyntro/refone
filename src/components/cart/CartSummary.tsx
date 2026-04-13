"use client";

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { FiArrowRight, FiShield, FiTag } from "react-icons/fi";
import { openLoginModal, setRedirectPath } from "@/redux/features/authSlice";

const CartSummary: React.FC = () => {
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const { pricing, totalQuantity } = useSelector((state: RootState) => state.cart);
    const { token } = useSelector((state: RootState) => state.auth);
    const [promoCode, setPromoCode] = useState("");
    const [appliedPromo, setAppliedPromo] = useState(false);

    const p = pricing || {
        subtotal: 0,
        delivery_charge: 0,
        discount: 0,
        tax: 0,
        grand_total: 0,
    };

    const handleApplyPromo = (e: React.FormEvent) => {
        e.preventDefault();
        if (promoCode.trim()) {
            setAppliedPromo(true);
            setPromoCode("");
            toast.success(`Promo code applied successfully!`);
        }
    };

    const handleCheckout = () => {
        if (!token) {
            dispatch(setRedirectPath("/checkout"));
            dispatch(openLoginModal());
            toast.info("Please login to proceed to checkout");
            return;
        }
        router.push("/checkout");
    };

    const formatPrice = (amount: number) => {
        return `₹ ${amount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    return (
        <div className="cart-summary">
            <div className="cart-summary-header">
                <h2>Order Summary</h2>
                <p>{totalQuantity} Items in your cart</p>
            </div>

            <div className="cart-summary-body">
                <div className="cart-summary-breakdown">
                    <div className="summary-row">
                        <span>Subtotal</span>
                        <span className="summary-val">{formatPrice(p.subtotal)}</span>
                    </div>
                    <div className="summary-row">
                        <span>Delivery</span>
                        {p.delivery_charge === 0 ? (
                            <span className="summary-val text-success">Free</span>
                        ) : (
                            <span className="summary-val">{formatPrice(p.delivery_charge)}</span>
                        )}
                    </div>
                    <div className="summary-row">
                        <span>Tax</span>
                        <span className="summary-val">{formatPrice(p.tax)}</span>
                    </div>
                    {p.discount > 0 && (
                        <div className="summary-row text-success">
                            <span>Discount</span>
                            <span className="summary-val">-{formatPrice(p.discount)}</span>
                        </div>
                    )}
                </div>

                <div className="cart-summary-total">
                    <span>Grand Total</span>
                    <span className="total-val">{formatPrice(p.grand_total)}</span>
                </div>

                <form onSubmit={handleApplyPromo} className="promo-form">
                    <label htmlFor="promo">
                        <FiTag />
                        Have a promo code?
                    </label>
                    <div className="promo-input-group">
                        <input
                            type="text"
                            id="promo"
                            value={promoCode}
                            onChange={(e) => setPromoCode(e.target.value)}
                            placeholder="Enter code"
                        />
                        <button type="submit" disabled={!promoCode.trim()}>
                            Apply
                        </button>
                    </div>
                    {appliedPromo && (
                        <p className="promo-success">✨ Promo code applied successfully.</p>
                    )}
                </form>

                <div className="cart-summary-actions">
                    <button
                        onClick={handleCheckout}
                        disabled={totalQuantity === 0}
                        className="btn-checkout"
                    >
                        Proceed to Checkout
                        <FiArrowRight />
                    </button>
                    <button
                        onClick={() => router.push("/")}
                        className="btn-back"
                    >
                        Back to Shop
                    </button>
                </div>

                <div className="trust-badge">
                    <FiShield size={16} />
                    Secure checkout powered by Razorpay
                </div>
            </div>
        </div>
    );
};

export default CartSummary;
