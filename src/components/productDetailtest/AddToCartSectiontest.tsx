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
    showBuyNow = false }) => {
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

    const handleDirectBuy = async () => {
        if (!product || !selectedVariant) {
            alert("Please select a variant first.");
            return;
        }

        if (!user?.id) {
            dispatch(setRedirectPath("/checkout"));
            dispatch(openLoginModal());

            // Still add locally so it's in the cart when they log in
            if (!addedToCart) {
                dispatch(addLocalItem({
                    id: Date.now(),
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
            }
            return;
        }

        try {
            setIsLoading(true);
            if (!addedToCart) {
                await dispatch(addToCart({
                    user_id: Number(user.id),
                    product_id: product.id,
                    variant_id: selectedVariant.id,
                    quantity: 1,
                })).unwrap();
                setAddedToCart(true);
            }
            router.push("/checkout");
        } catch (error: any) {
            alert(error || "Failed to proceed to checkout");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.addToCart}>
            <div className={styles.buttonRow}>
                <button
                    className={styles.cartBtn}
                    onClick={() => {
                        if (addedToCart) {
                            router.push("/cart");
                        } else {
                            handleAddToCart();
                        }
                    }}
                    disabled={isLoading}
                >
                    <FaShoppingCart />
                    {isLoading
                        ? "Adding..."
                        : addedToCart
                            ? "Go to Cart"
                            : "Add to Cart"}
                </button>

                {showBuyNow && (
                    <button
                        className={styles.buyNowBtn}
                        onClick={handleDirectBuy}
                        disabled={isLoading}
                    >
                        <FaBolt /> Buy Now
                    </button>
                )}
            </div>

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
