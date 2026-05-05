"use client";

import React, { useEffect, useState } from "react";
import { FaShoppingCart } from "react-icons/fa";
import { FiShield } from "react-icons/fi";
import styles from "./AddToCartSectiontest.module.css";
import { ProductTest, VariantTest } from "@/types/producttest";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { addToCart, addLocalItem } from "@/redux/features/cartSlice";
import { openLoginModal, setRedirectPath } from "@/redux/features/authSlice";
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

const AddToCartSectiontest: React.FC<AddToCartSectionProps> = ({
    product,
    selectedVariant,
    showWishlist = true,
    showBuyNow = false,
    isIconOnly = false,
}) => {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const [addedToCart, setAddedToCart] = useState(false);
    const [isLoading, setIsLoading] = React.useState(false);
    const [isMounted, setIsMounted] = useState(false);

    const { user } = useSelector((state: RootState) => state.auth);
    const { isLoading: isCartLoading } = useSelector((state: RootState) => state.cart);

    const stock = selectedVariant?.inventory?.total_stock ?? 0;
    const inboundStock = selectedVariant?.inventory?.inbound_stock ?? 0;
    const isActive = selectedVariant?.inventory?.is_active === 1;
    const isInStock = stock > 0 || inboundStock > 0 || isActive;
    const isOutOfStock = !isInStock;

    const sellingPrice = Number(selectedVariant?.pricing?.selling_price ?? 0);
    const mrp = Number(selectedVariant?.pricing?.mrp ?? 0);
    const discountPct = mrp > 0 && sellingPrice > 0 ? Math.round(((mrp - sellingPrice) / mrp) * 100) : 0;
    // "Buy for as low as" price (5% more savings simulation)
    const prepaidPrice = sellingPrice > 0 ? Math.round(sellingPrice * 0.95) : 0;

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const handleAddToCart = async () => {
        if (!product || !selectedVariant) {
            toast.error("Please select a variant first.");
            return;
        }

        if (!user?.id) {
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

    // Icon-only mode (for cards)
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

    // Skeleton
    if (!selectedVariant) {
        return (
            <div className={styles.addToCart}>
                <div className={styles.skeletonPrice} />
                <div className={styles.skeletonBtn} />
                <div className={styles.skeletonBtn} style={{ marginTop: 10 }} />
            </div>
        );
    }

    return (
        <div className={styles.addToCart}>
            {/* Price Section */}
            <div className={styles.priceSection}>
                {isOutOfStock ? (
                    <span className={styles.outOfStockText}>Updating soon</span>
                ) : (
                    <>
                        <div className={styles.priceRow}>
                            <span className={styles.sellingPrice}>
                                ₹{sellingPrice.toLocaleString("en-IN")}
                            </span>
                            {mrp > 0 && sellingPrice < mrp && (
                                <>
                                    <span className={styles.mrp}>₹{mrp.toLocaleString("en-IN")}</span>
                                    {discountPct > 0 && (
                                        <span className={styles.discountTag}>{discountPct}% OFF</span>
                                    )}
                                </>
                            )}
                        </div>
                        <p className={styles.taxNote}>Inclusive of all taxes</p>

                        {/* Buy for as low as */}
                        {prepaidPrice > 0 && (
                            <div className={styles.prepaidRow}>
                                <FiShield className={styles.prepaidIcon} />
                                <div>
                                    <span className={styles.prepaidText}>
                                        Buy for as low as <strong>₹{prepaidPrice.toLocaleString("en-IN")}</strong>
                                    </span>
                                    <span className={styles.prepaidNote}>Get extra ₹1,500 off on prepaid orders</span>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Buttons */}
            <div className={styles.buttonRow}>
                <button
                    id="add-to-cart-btn"
                    className={`${styles.cartBtn} ${!isInStock ? styles.disabledBtn : ""} ${addedToCart ? styles.goToCartBtn : ""}`}
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
                    <FaShoppingCart className={styles.btnIcon} />
                    {!isInStock
                        ? "Out of Stock"
                        : isLoading
                            ? "Adding..."
                            : addedToCart
                                ? "Go to Cart"
                                : "Add to Cart"}
                </button>

                {showBuyNow && (
                    <button
                        id="buy-now-btn"
                        className={`${styles.buyNowBtn} ${!isInStock ? styles.disabledBtn : ""}`}
                        onClick={() => {
                            if (!isInStock) return;
                            handleDirectBuy();
                        }}
                        disabled={isLoading || !isInStock}
                    >
                        Buy Now
                    </button>
                )}
            </div>
        </div>
    );
};

export default AddToCartSectiontest;
