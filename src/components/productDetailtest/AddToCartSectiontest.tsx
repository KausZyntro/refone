"use client";

import React, { useState } from "react";
import { FaHeart, FaShoppingCart, FaTruck, FaShieldAlt, FaBolt } from "react-icons/fa";
import styles from "./AddToCartSectiontest.module.css";
import { ProductTest, VariantTest } from "@/types/producttest";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { addToCart } from "@/redux/features/cartSlice";
import { createPaymentStatus, placeOrder } from "@/redux/features/orderSlice";
import { useRouter } from "next/navigation";

interface AddToCartSectionProps {
    product: ProductTest | null;
    selectedVariant: VariantTest | null;
}

const AddToCartSectiontest: React.FC<AddToCartSectionProps> = ({ product, selectedVariant }) => {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const [addedToCart, setAddedToCart] = useState(false);

    const { user } = useSelector((state: RootState) => state.auth);
    const { selectedAddressId } = useSelector((state: RootState) => state.address);
    const { isLoading: isCartLoading } = useSelector((state: RootState) => state.cart);
    const { isProcessingPayment, isLoading: isPlacingOrder } = useSelector((state: RootState) => state.order);

    const loadRazorpay = () => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handleAddToCart = async () => {
        if (!product || !selectedVariant) {
            alert("Please select a variant first.");
            return;
        }

        try {
            await dispatch(addToCart({
                user_id: Number(user?.id),
                product_id: product.id,
                variant_id: selectedVariant.id,
                quantity: 1,
            })).unwrap();
            setAddedToCart(true);
            alert("Item added to cart!");
        } catch (error: any) {
            alert(error || "Failed to add to cart");
        }
    };

    const handleBuyNow = async () => {
        if (!user?.id) {
            alert("Please login to proceed.");
            return;
        }

        if (!selectedVariant) {
            alert("Please select a variant first.");
            return;
        }

        if (!selectedAddressId) {
            alert("Please select a delivery address in your profile/checkout first.");
            // Optionally redirect to a checkout/address page
            // router.push("/checkout"); 
            return;
        }

        const res = await loadRazorpay();
        if (!res) {
            alert("Razorpay SDK failed to load. Are you online?");
            return;
        }

        const amount = Number(selectedVariant.pricing.selling_price);

        const options = {
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_mock_123",
            amount: Math.round(amount * 100),
            currency: "INR",
            name: "Refone",
            description: `Payment for ${product?.name}`,
            handler: async function (response: any) {
                try {
                    // 1. Create Payment Status
                    const pmtRes = await dispatch(
                        createPaymentStatus({
                            pmt_order_id: response.razorpay_order_id || "mock_order_id_" + Date.now(),
                            payment_status: "success",
                            payment_method: "online",
                            amount: amount,
                        })
                    ).unwrap();

                    const pymt_id = pmtRes.id;

                    // 2. Place Order
                    await dispatch(
                        placeOrder({
                            customer_id: Number(user.id),
                            variant_id: Number(selectedVariant.id),
                            product_id: Number(product?.id),
                            quantity: 1,
                            address_id: selectedAddressId,
                            order_id: response.razorpay_order_id || "mock_order_id_" + Date.now(),
                            pymt_id: pymt_id,
                        })
                    ).unwrap();

                    alert("Order placed successfully!");
                    router.push("/order-success"); // Or wherever appropriate
                } catch (error: any) {
                    alert(error || "Payment or Order failed. Please try again.");
                }
            },
            prefill: {
                name: user?.name,
                email: user?.email,
                contact: user?.phone,
            },
            theme: {
                color: "#2C2C2C",
            },
        };

        const paymentObject = new (window as any).Razorpay(options);
        paymentObject.open();
    };

    return (
        <div className={styles.addToCart}>
            <div className={styles.buttonRow}>
                <button
                    className={styles.cartBtn}
                    onClick={handleAddToCart}
                    disabled={isCartLoading}
                >
                    <FaShoppingCart /> {isCartLoading ? "Adding..."
                        : addedToCart
                        ? "Go to Cart"
                        : "Add to Cart"}
                </button>
                {/* <button
                    className={styles.buyNowBtn}
                    onClick={addedToCart ? () => router.push("/cart") : handleAddToCart}
                    disabled={isProcessingPayment || isPlacingOrder}
                >
                    <FaBolt /> {isProcessingPayment || isPlacingOrder ? "Adding..."
                        : addedToCart
                        ? "Go to Cart"
                        : "Add to Cart"}
                </button> */}
            </div>

            <div className={styles.wishlistRow}>
                <button className={styles.wishlistBtn}>
                    <FaHeart /> Add to Wishlist
                </button>
            </div>
                    
            
        </div>
        
    );
};

export default AddToCartSectiontest;
