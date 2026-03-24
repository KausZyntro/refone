"use client";

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { placeOrder } from "@/redux/features/orderSlice";
import { useRouter } from "next/navigation";
import Image from "next/image";

const CheckoutSummary: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();

    // Auth, Cart, Address, and Order state
    const { user } = useSelector((state: RootState) => state.auth);
    const { items, pricing, totalQuantity } = useSelector((state: RootState) => state.cart);
    const { selectedAddressId } = useSelector((state: RootState) => state.address);
    const { isLoading: isPlacingOrder, success } = useSelector((state: RootState) => state.order);

    const formatPrice = (amount: number) => {
        return `₹ ${amount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    const p = pricing || {
        subtotal: 0,
        delivery_charge: 0,
        discount: 0,
        tax: 0,
        grand_total: 0,
    };

    const handlePlaceOrder = () => {
        if (!user?.id || !selectedAddressId) return;

        dispatch(
            placeOrder({
                user_id: user.id,
                address_id: selectedAddressId,
                payment_method: "Razorpay", // Mock default
            })
        );
    };

    // If order placed successfully, optionally router.push('/success-page')
    if (success) {
        alert("Order placed successfully!");
        router.push("/");
        // In real app, redirect to order confirmation page or reset states
    }

    return (
        <div className="checkout-summary-card">
            <h3 className="checkout-summary-title">Order Summary</h3>

            {/* Micro items display */}
            <div className="checkout-items-preview">
                {items.length === 0 ? (
                    <p className="text-sm text-gray-500">Your cart is empty.</p>
                ) : (
                    items.map((item) => {
                        const price = Number(item.price?.selling_price || 0);
                        const imageUrl = item.variant?.[0]?.images?.[0]?.image_url;

                        return (
                            <div key={item.id} className="checkout-item-micro">
                                <div className="checkout-item-micro-img">
                                    {imageUrl ? (
                                        <img
                                            src={imageUrl}
                                            alt={item.product?.name || "Product"}
                                            // fill
                                            className="object-cover"
                                            sizes="48px"
                                        />
                                    ) : (
                                        <div className="no-img-micro" />
                                    )}
                                </div>
                                <div className="checkout-item-micro-details">
                                    <p className="micro-title">{item.product?.name}</p>
                                    <p className="micro-qty">Qty: {item.quantity}</p>
                                </div>
                                <div className="checkout-item-micro-price">
                                    {formatPrice(price * Number(item.quantity))}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            <hr className="summary-divider" />

            {/* Pricing Details */}
            <div className="summary-breakdown">
                <div className="summary-row">
                    <span>Items ({totalQuantity}):</span>
                    <span>{formatPrice(p.subtotal)}</span>
                </div>
                <div className="summary-row">
                    <span>Delivery:</span>
                    {p.delivery_charge === 0 ? (
                        <span className="text-success">Free</span>
                    ) : (
                        <span>{formatPrice(p.delivery_charge)}</span>
                    )}
                </div>
                <div className="summary-row">
                    <span>Tax:</span>
                    <span>{formatPrice(p.tax)}</span>
                </div>
                {p.discount > 0 && (
                    <div className="summary-row text-success">
                        <span>Discount:</span>
                        <span>-{formatPrice(p.discount)}</span>
                    </div>
                )}
            </div>

            <hr className="summary-divider" />

            <div className="summary-grand-total">
                <span>Order Total:</span>
                <span className="grand-total-val">{formatPrice(p.grand_total)}</span>
            </div>

            <button
                className="btn-place-order"
                disabled={!selectedAddressId || totalQuantity === 0 || isPlacingOrder}
                onClick={handlePlaceOrder}
            >
                {isPlacingOrder ? "Processing..." : "Proceed to Payment"}
            </button>
            {!selectedAddressId && totalQuantity > 0 && (
                <p className="checkout-warning">Please select a delivery address to proceed.</p>
            )}
        </div>
    );
};

export default CheckoutSummary;
