"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { useRouter } from "next/navigation";
import { HiOutlineTicket } from "react-icons/hi";

import RazorpayButton from "./RazorpayButton";

const CheckoutSummary: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();

    // Auth, Cart, Address, and Order state
    const { user } = useSelector((state: RootState) => state.auth);
    const { items, pricing, totalQuantity } = useSelector((state: RootState) => state.cart);
    const { selectedAddressId } = useSelector((state: RootState) => state.address);
    const { isLoading: isPlacingOrder, isProcessingPayment } = useSelector((state: RootState) => state.order);

    // Coupon State (Frontend Only)
    const [couponApplied, setCouponApplied] = useState(false);
    const [couponCode] = useState("MOTHER5");
    const [couponDiscountPercent] = useState(5);

    useEffect(() => {
        // Default Coupon Auto-Apply on page load
        setCouponApplied(true);
    }, []);

    const p = pricing || {
        subtotal: 0,
        delivery_charge: 0,
        discount: 0,
        tax: 0,
        grand_total: 0,
    };

    // Discount Calculation Logic
    const {
        originalPrice,
        baseDiscount,
        couponDiscount,
        totalDiscount,
        extraDiscountAmount,
        finalGrandTotal
    } = useMemo(() => {
        const sub = Number(p.subtotal || 0);
        const baseDiscAmount = Number(p.discount || 0);
        
        // baseDiscount as percentage of subtotal
        const baseDiscPercent = sub > 0 ? (baseDiscAmount / sub) * 100 : 0;
        
        // couponDiscount is 5%
        const coupDisc = couponApplied ? couponDiscountPercent : 0;
        
        // totalDiscount = baseDiscount + 5
        const totalDiscPercent = baseDiscPercent + coupDisc;
        
        // extraDiscountAmount = originalPrice * couponDiscount / 100
        const extraDiscAmount = couponApplied ? (sub * couponDiscountPercent / 100) : 0;
        
        // finalPrice = originalPrice - (originalPrice * totalDiscount / 100)
        // Note: p.grand_total already subtracts p.discount. 
        // So finalGrandTotal = p.grand_total - extraDiscAmount
        const finalTotal = Number(p.grand_total || 0) - extraDiscAmount;

        return {
            originalPrice: sub,
            baseDiscount: baseDiscPercent,
            couponDiscount: coupDisc,
            totalDiscount: totalDiscPercent,
            extraDiscountAmount: extraDiscAmount,
            finalGrandTotal: Math.max(0, finalTotal)
        };
    }, [p, couponApplied, couponDiscountPercent]);

    const formatPrice = (amount: number) => {
        return `₹ ${amount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

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
                                            className="object-cover"
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
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

            {/* Coupon Section */}
            <div className="checkout-coupon-section">
                <div className="coupon-input-group">
                    <div className="coupon-input-box">
                        <HiOutlineTicket className="coupon-icon" />
                        <input 
                            type="text" 
                            value={couponCode} 
                            readOnly 
                            placeholder="Enter Coupon Code"
                            className="coupon-input"
                        />
                        {couponApplied && <span className="coupon-applied-badge">Applied</span>}
                    </div>
                    <button 
                        className={`coupon-apply-btn ${couponApplied ? 'applied' : ''}`}
                        disabled={couponApplied}
                    >
                        {couponApplied ? "Applied" : "Apply"}
                    </button>
                </div>
                {couponApplied && (
                    <p className="coupon-success-text">
                        Extra 5% discount applied with <strong>{couponCode}</strong>
                    </p>
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
                        <span>Base Discount:</span>
                        <span>-{formatPrice(p.discount)}</span>
                    </div>
                )}
                {extraDiscountAmount > 0 && (
                    <div className="summary-row text-success">
                        <span>Coupon Discount ({couponDiscountPercent}%):</span>
                        <span>-{formatPrice(extraDiscountAmount)}</span>
                    </div>
                )}
            </div>

            <hr className="summary-divider" />

            <div className="summary-grand-total">
                <div className="total-label-box">
                    <span>Order Total:</span>
                    {/* {couponApplied && (
                        <span className="total-discount-tag">Total Discount: {totalDiscount.toFixed(1)}%</span>
                    )} */}
                </div>
                <span className="grand-total-val">{formatPrice(finalGrandTotal)}</span>
            </div>

            <RazorpayButton
                className="btn-place-order"
                label="Proceed to Payment"
                amount={finalGrandTotal}
            />

            {!selectedAddressId && totalQuantity > 0 && (
                <p className="checkout-warning">Please select a delivery address to proceed.</p>
            )}
        </div>
    );
};
;

export default CheckoutSummary;
