"use client";

import React, { useState } from "react";
import Image from "next/image";
import styles from "./RelatedProductstest.module.css";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { addToCart, addLocalItem } from "@/redux/features/cartSlice";
import { parsePrice } from "@/utils/format";
import { toast } from "react-toastify";
import {  VariantTest } from "@/types/producttest";
import { useRouter } from "next/navigation";

interface RelatedProductsTestProps {
    products: any[];
    onProductSelect?: (product: any) => void;
    selectedVariant: VariantTest | null;
}

const RelatedProductstest: React.FC<RelatedProductsTestProps> = ({ products, selectedVariant,onProductSelect }) => {
    const dispatch = useDispatch<AppDispatch>();
    const { user } = useSelector((state: RootState) => state.auth);
    const [loadingProductId, setLoadingProductId] = useState<number | null>(null);
    const stock = selectedVariant?.inventory?.total_stock ?? 0;
    const isInStock = stock > 0;

    if (!products || products.length === 0) return null;

    const handleAddToCart = async (product: any, e: React.MouseEvent) => {
        e.stopPropagation(); 
        
        const firstVariant = product.variants?.[0];
        if (!firstVariant) {
            toast.error("No variants available for this product.");
            return;
        }

        if (!user?.id) {
            dispatch(addLocalItem({
                id: Date.now(),
                product_id: product.id,
                variant_id: firstVariant.id,
                quantity: 1,
                item_total: parsePrice(firstVariant.pricing.selling_price),
                product: {
                    name: product.name,
                    image: firstVariant.images[0]?.image_url || ""
                },
                variant: [{
                    storage: firstVariant.storage,
                    color: firstVariant.color,
                    images: firstVariant.images.map((img: any) => ({
                        id: img.id,
                        variant_id: img.variant_id,
                        image_url: img.image_url
                    }))
                }],
                price: {
                    selling_price: firstVariant.pricing.selling_price
                }
            }));
            toast.success("Item added to cart (Guest)!");
            return;
        }

        try {
            setLoadingProductId(product.id);
            await dispatch(addToCart({
                user_id: Number(user?.id),
                product_id: product.id,
                variant_id: firstVariant.id,
                quantity: 1,
            })).unwrap();
            toast.success("Item added to cart!");
        } catch (error: any) {
            toast.error(error || "Failed to add to cart");
        } finally {
            setLoadingProductId(null);
        }
    };

    return (
        <aside className={styles.relatedSection}>
            <h3 className={styles.sectionTitle}>You Might Also Like</h3>
            <div className={styles.productsContainer}>
                {products.map((product) => {
                    const variant = product.variants?.[0];
                    const stock = variant?.inventory?.total_stock ?? 0;
                    const isInStock = stock > 0;

                    // console.log(variant)
                    console.log(variant?.pricing?.selling_price
)
                    return (
                        <div 
                            key={product.id} 
                            className={styles.card}
                            onClick={() => onProductSelect?.(product)}
                            style={{ cursor: "pointer" }}
                        >
                            <div className={styles.imageWrapper}>
                                <Image
                                    src={variant?.images?.[0]?.thumbnail_url || variant?.images?.[0]?.image_url || "/images/placeholder.png"}
                                    alt={product.name}
                                    width={120}
                                    height={120}
                                    className={styles.cardImage}
                                />
                            </div>
                            <div className={styles.cardInfo}>
                                <span className={styles.cardTitle}>{product.name}</span>
                                <span className={styles.cardSubtitle}>
                                    {variant ? `${variant.storage || ''} | ${variant.color || ''}` : "View product"}
                                </span>
                                {variant?.pricing?.selling_price && (
                                    <span className={styles.cardPrice}>₹{Number(variant.pricing.selling_price).toLocaleString("en-IN")}</span>
                                )}
                                {/* correct price display */}
                                 {/* <span className={styles.sellingPrice}>
                                    ₹XXXX
                                    </span> */}
                                <button 
                                className={`${styles.cardBtn} ${!isInStock ? styles.outOfStockBtn : ""}`}
                                onClick={(e) => handleAddToCart(product, e)}
                                disabled={loadingProductId === product.id || !isInStock}
                                >
                                {loadingProductId === product.id 
                                    ? "..." 
                                    : !isInStock
                                    ? "Out of Stock"
                                    : "Add to Cart"}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </aside>
    );
};

export default RelatedProductstest;
