"use client";

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { placeOrder, createPaymentStatus } from "@/redux/features/orderSlice";
import { clearCart } from "@/redux/features/cartSlice";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "react-toastify";

const CheckoutSummary: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();

    // Auth, Cart, Address, and Order state
    const { user } = useSelector((state: RootState) => state.auth);
    const { items, pricing, totalQuantity } = useSelector((state: RootState) => state.cart);
    const { selectedAddressId } = useSelector((state: RootState) => state.address);
    const { isLoading: isPlacingOrder, isProcessingPayment } = useSelector((state: RootState) => state.order);

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

    const loadRazorpay = () => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    // const handlePlaceOrder = async () => {
    //     if (!user?.id || !selectedAddressId) return;

    //     const res = await loadRazorpay();

    //     if (!res) {
    //         toast.error("Razorpay SDK failed to load. Are you online?");
    //         return;
    //     }

    //     const firstItem = items[0] || {};

    //     const options = {
    //         key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_mock_123", // Replace with real key
    //         amount: Math.round(p.grand_total * 100),
    //         currency: "INR",
    //         name: "Refone",
    //         description: "Payment for your order",
    //         handler: async function (response: any) {
    //             try {
    //                 // 1. Create Payment Status
    //                 const pmtRes = await dispatch(
    //                     createPaymentStatus({
    //                         pmt_order_id: response.razorpay_order_id || "mock_order_id",
    //                         payment_status: "success",
    //                         payment_method: "online",
    //                         amount: p.grand_total,
    //                     })
    //                 ).unwrap();

    //                 const pymt_id = pmtRes.id;

    //                 // 2. Place Order
    //                 await dispatch(
    //                     placeOrder({
    //                         customer_id: Number(user.id),
    //                         variant_id: Number(firstItem.variant_id) || 0,
    //                         product_id: Number(firstItem.product_id) || 0,
    //                         quantity: Number(firstItem.quantity) || 1,
    //                         address_id: selectedAddressId,
    //                         order_id: response.razorpay_order_id || "mock_order_id",
    //                         pymt_id: pymt_id,
    //                     })
    //                 ).unwrap();

    //                 toast.success("Order placed successfully!");
    //                 dispatch(clearCart());
    //                 router.push("/order-success");
    //             } catch (error: any) {
    //                 toast.error(error || "Payment or Order failed. Please try again.");
    //             }
    //         },
    //         prefill: {
    //             name: user?.name,
    //             email: user?.email,
    //             contact: user?.phone,
    //         },
    //         theme: {
    //             color: "#3399cc",
    //         },
    //     };

    //     const paymentObject = new (window as any).Razorpay(options);
    //     paymentObject.open();
    // };

    const handlePlaceOrder = async () => {
        router.push("/server-busy");
    }
    // ye section hatega bad me upper wala lagega wapas
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
                disabled={!selectedAddressId || totalQuantity === 0 || isPlacingOrder || isProcessingPayment}
                onClick={handlePlaceOrder}
            >
                {isPlacingOrder || isProcessingPayment ? "Processing..." : "Proceed to Payment"}
            </button>
            {!selectedAddressId && totalQuantity > 0 && (
                <p className="checkout-warning">Please select a delivery address to proceed.</p>
            )}
        </div>
    );
};

export default CheckoutSummary;
