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
import { toast } from "react-toastify";

interface AddToCartSectionProps {
    product: ProductTest | null;
    selectedVariant: VariantTest | null;
    showWishlist?: boolean;
    showBuyNow?: boolean;
    isIconOnly?: boolean;
}

const AddToCartSectiontest: React.FC<AddToCartSectionProps> = ({ product, selectedVariant, showWishlist = true,
    showBuyNow = false, isIconOnly = false }) => {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const [addedToCart, setAddedToCart] = useState(false);
    const [isLoading, setIsLoading] = React.useState(false);

    const { user } = useSelector((state: RootState) => state.auth);
    const { selectedAddressId } = useSelector((state: RootState) => state.address);
    const { isLoading: isCartLoading } = useSelector((state: RootState) => state.cart);
    const [isMounted, setIsMounted] = useState(false);
    const { isProcessingPayment, isLoading: isPlacingOrder } = useSelector((state: RootState) => state.order);

    const stock = selectedVariant?.inventory?.total_stock ?? 0;
    const inboundStock = selectedVariant?.inventory?.inbound_stock ?? 0;
    const isActive = selectedVariant?.inventory?.is_active === 1;
    const isInStock = stock > 0 || inboundStock > 0 || isActive;

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
            toast.error("Please select a variant first.");
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
            toast.success("Item added to cart (Guest)!");
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
            toast.success("Item added to cart!");
        } catch (error: any) {
            toast.error(error || "Failed to add to cart");
        }
        setIsLoading(false);
    };

    const handleDirectBuy = async () => {
        if (!product || !selectedVariant) {
            toast.error("Please select a variant first.");
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
            toast.error(error || "Failed to proceed to checkout");
        } finally {
            setIsLoading(false);
        }
    };

    if (isIconOnly) {
        return (
            <button
                className={`${styles.cartIconBtn} ${!isInStock ? styles.outOfStockBtn : ""} ${addedToCart ? styles.addedBtn : ""}`}
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (!isInStock) return;
                    if (addedToCart) {
                        router.push("/cart");
                    } else {
                        handleAddToCart();
                    }
                }}
                disabled={isLoading || !isInStock}
                title={!isInStock ? "Out of Stock" : addedToCart ? "Go to Cart" : "Add to Cart"}
            >
                <FaShoppingCart />
            </button>
        );
    }

    return (
        <div className={styles.addToCart}>
            <div className={styles.buttonRow}>
                <button
                    className={`${styles.cartBtn} ${!isInStock ? styles.outOfStockBtn : ""}`}
                    onClick={() => {
                        if (!isInStock) return;
                        if (addedToCart) {
                            router.push("/cart");
                        } else {
                            handleAddToCart();
                        }
                    }}
                    disabled={isLoading || !isInStock}
                >
                    <FaShoppingCart />
                    {!isInStock
                        ? "Out of Stock"
                        :isLoading
                        ? "Adding..."
                        : addedToCart
                            ? "Go to Cart"
                            : "Add to Cart"}
                </button>

                {showBuyNow && (
                    <button
                        className={styles.buyNowBtn}
                        onClick={() => {
                            if (!isInStock) return;
                            handleDirectBuy();
                            }}
                        disabled={isLoading || !isInStock}
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
