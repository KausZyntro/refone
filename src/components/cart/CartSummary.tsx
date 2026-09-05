"use client";

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { FiArrowRight, FiShield, FiTag } from "react-icons/fi";
import { openLoginModal, setRedirectPath } from "@/redux/features/authSlice";
import SnapmintEMI from "../SnapmintLoader";



// function SnapmintEMI({ price }: { price: number }) {
//   React.useEffect(() => {
//     if (!price || price <= 0) return;

//     const initialize = () => {
//       const container = document.getElementById("cart-snapmint");

//       console.log("Cart Snapmint container:", container);
//       console.log("Snapmint loadOnPage:", window.loadOnPage);

//       if (
//         container &&
//         typeof window.loadOnPage === "function"
//       ) {
//         window.loadOnPage();
//       }
//     };

//     const script = document.getElementById(
//       "snapmint-script"
//     ) as HTMLScriptElement | null;

//     if (!script) {
//       const newScript = document.createElement("script");

//       newScript.id = "snapmint-script";
//       newScript.src =
//         "https://checkout-merchant.snapmint.com/js/v1/2025";
//       newScript.async = true;

//       newScript.onload = () => {
//         setTimeout(initialize, 500);
//       };

//       newScript.onerror = () => {
//         console.error("Snapmint script failed to load");
//       };

//       document.body.appendChild(newScript);
//     } else {
//       setTimeout(initialize, 500);
//     }
//   }, [price]);

//   return (
//     <div
//       id="cart-snapmint"
//       className="snapmint-emi-container"
//       style={{
//         minHeight: "30px",
//         width: "100%",
//       }}
//     >
//       <div className="snap_emi_txt" />

//       <span
//         className="snapmint_lowest_emi_value"
//         data-snapmint-price={price}
//         data-snapmint-merchant_id="1439"
//         data-snapmintpage="products_page"
//       />
//     </div>
//   );
// }



interface CartSummaryProps {
    selectedPaymentMode?: string | null;
}

const CartSummary: React.FC<CartSummaryProps> = ({ selectedPaymentMode = null }) => {
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
        if (!selectedPaymentMode) {
            toast.error("Please select a payment mode to proceed.");
            return;
        }
        if (!token) {
            dispatch(setRedirectPath("/checkout"));
            dispatch(openLoginModal());
            toast.info("Please login to proceed to checkout");
            return;
        }
        router.push("/checkout");
    };
    // const handleTrafficPage = () => {
    //      router.push("/server-busy");
    // }

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

                {/* <form onSubmit={handleApplyPromo} className="promo-form">
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
                </form> */}

                <div className="cart-summary-actions">
                      {/* {p.grand_total > 0 && <SnapmintEMI price={p.grand_total} />} */}
                      {p.grand_total > 0 && (
                         <SnapmintEMI price={p.grand_total} page="products_page"/>
                     )}

                    <button
                        onClick={handleCheckout}
                        // onClick={handleTrafficPage}
                        disabled={totalQuantity === 0 || !selectedPaymentMode}
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
