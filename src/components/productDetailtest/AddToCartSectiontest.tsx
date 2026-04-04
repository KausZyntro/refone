"use client";

import React, { useEffect, useState } from "react";
import { FaHeart, FaShoppingCart, FaTruck, FaShieldAlt, FaBolt } from "react-icons/fa";
import styles from "./AddToCartSectiontest.module.css";
import { ProductTest, VariantTest } from "@/types/producttest";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { addToCart, addLocalItem } from "@/redux/features/cartSlice";
import { openLoginModal, setRedirectPath } from "@/redux/features/authSlice";
import { createPaymentStatus, placeOrder } from "@/redux/features/orderSlice";
import { useRouter } from "next/navigation";
import { parsePrice } from "@/utils/format";

interface AddToCartSectionProps {
    product: ProductTest | null;
    selectedVariant: VariantTest | null;
    showWishlist?: boolean;
    showBuyNow?: boolean;
}

const AddToCartSectiontest: React.FC<AddToCartSectionProps> = ({ product, selectedVariant, showWishlist = true,
    showBuyNow = true }) => {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const [addedToCart, setAddedToCart] = useState(false);
    const [isLoading, setIsLoading] = React.useState(false);

    const { user } = useSelector((state: RootState) => state.auth);
    const { selectedAddressId } = useSelector((state: RootState) => state.address);
    const { isLoading: isCartLoading } = useSelector((state: RootState) => state.cart);
    const [isMounted, setIsMounted] = useState(false);
    const { isProcessingPayment, isLoading: isPlacingOrder } = useSelector((state: RootState) => state.order);

    useEffect(() => {
        setIsMounted(true);
    }, []);

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

        if (!user?.id) {
            // Guest mode: add locally
            dispatch(addLocalItem({
                id: Date.now(), // Temporary ID for guest item
                product_id: product.id,
                variant_id: selectedVariant.id,
                quantity: 1,
                item_total: parsePrice(selectedVariant.pricing.selling_price),
                product: {
                    name: product.name,
                    image: selectedVariant.images[0]?.image_url || ""
                },
                variant: [{
                    storage: selectedVariant.storage,
                    color: selectedVariant.color,
                    images: selectedVariant.images.map(img => ({
                        id: img.id,
                        variant_id: img.variant_id,
                        image_url: img.image_url
                    }))
                }],
                price: {
                    selling_price: selectedVariant.pricing.selling_price
                }
            }));
            setAddedToCart(true);
            alert("Item added to cart (Guest)!");
            return;
        }

        try {
            setIsLoading(true);
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
        setIsLoading(false);
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

        const amount = parsePrice(selectedVariant.pricing.selling_price);

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
            {showBuyNow && (
                <div className={styles.buttonRow}>
                    <button
                        className={styles.cartBtn}
                        // onClick={handleAddToCart}
                        // onClick={addedToCart ? () => router.push("/cart"):handleAddToCart}
                        onClick={() => {
                            if (addedToCart) {
                                if (!user?.id) {
                                    dispatch(setRedirectPath("/cart"));
                                    dispatch(openLoginModal());
                                    return;
                                }
                                router.push("/cart");
                            } else {
                                handleAddToCart();
                            }
                        }}
                        // disabled={isMounted ? isCartLoading : false}
                        disabled={isLoading}
                    >
                        <FaShoppingCart />
                        {/* {
                    isCartLoading ? "Adding..."
                        : addedToCart
                        ? "Go to Cart"
                        : "Add to Cart"} */}
                        {isLoading
                            ? "Adding..."
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
            )}

            {showWishlist && (
                <div className={styles.wishlistRow}>
                    <button className={styles.wishlistBtn}>
                        <FaHeart /> Add to Wishlist
                    </button>
                </div>
            )}


        </div>

    );
};

export default AddToCartSectiontest;
