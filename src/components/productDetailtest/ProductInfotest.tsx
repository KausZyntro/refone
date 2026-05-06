"use client";

import React from "react";
import RatingStarstest from "@/components/common/RatingStarstest";
import styles from "./ProductInfotest.module.css";
import { ProductTest, VariantTest } from "@/types/producttest";
import { FiShield, FiCheckCircle, FiCreditCard } from "react-icons/fi";

interface ProductInfoTestProps {
    product: ProductTest;
    selectedVariant: VariantTest | null;
    setSelectedVariant: (variant: VariantTest) => void;
}

const ProductInfotest: React.FC<ProductInfoTestProps> = ({ product, selectedVariant, setSelectedVariant }) => {

    /* ── Loading skeleton ── */
    if (!selectedVariant) {
        return (
            <div className={styles.productInfo}>
                <div className={styles.skeleton} style={{ height: 20, width: "30%", marginBottom: 10 }} />
                <div className={styles.skeleton} style={{ height: 30, width: "75%" }} />
                <div className={styles.skeleton} style={{ height: 16, width: "45%", marginTop: 10 }} />
                <div className={styles.skeleton} style={{ height: 14, width: "60%", marginTop: 12 }} />
                <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
                    {[1, 2, 3].map(i => (
                        <div key={i} className={styles.skeleton} style={{ width: 90, height: 56, borderRadius: 8 }} />
                    ))}
                </div>
                <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
                    {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className={styles.skeleton} style={{ width: 60, height: 60, borderRadius: 8 }} />
                    ))}
                </div>
            </div>
        );
    }

    /* ── Derived values ── */
    const selectedStorage = selectedVariant?.storage;

    // Group variants by storage for pills
    const storageGroups = (product?.variants ?? []).reduce(
        (acc: { storage: string; rep: VariantTest }[], v) => {
            if (!acc.find(g => g.storage === v.storage)) {
                acc.push({ storage: v.storage, rep: v });
            }
            return acc;
        },
        []
    );

    // Colors for selected storage
    const colorVariants = (product?.variants ?? []).filter(v => v.storage === selectedStorage);

    /* ── Min prices per storage ── */
    const minPriceForStorage = (storage: string) => {
        const variantsForStorage = (product?.variants ?? []).filter(v => v.storage === storage);
        const prices = variantsForStorage
            .map(v => Number(v?.pricing?.selling_price ?? 0))
            .filter(p => p > 0);
        return prices.length ? Math.min(...prices) : 0;
    };

    return (
        <div className={styles.productInfo}>

            {/* ── Bestseller badge ── */}
            <div className={styles.bestsellerBadge}>Bestseller</div>

            {/* ── Title ── */}
            <h1 className={styles.title}>
                {product?.brand?.name} {product?.name}
            </h1>

            {/* ── Rating ── */}
            <div className={styles.ratingRow}>
                <RatingStarstest rating={4.6} reviewCount={12458} />
            </div>

            {/* ── Trust checks ── */}
            <div className={styles.trustChecks}>
                <div className={styles.trustCheck}>
                    <FiShield className={styles.trustIcon} />
                    <span>32+ Quality Checks</span>
                </div>
                <div className={styles.trustCheck}>
                    <FiCheckCircle className={styles.trustIcon} />
                    <span>12 Months Warranty</span>
                </div>
            </div>
            <div className={styles.trustChecks} style={{ marginTop: 6 }}>
                <div className={styles.trustCheck}>
                    <FiCheckCircle className={styles.trustIcon} />
                    <span>100% Original Product</span>
                </div>
            </div>

            {/* ── Select Variant (Storage pills) ── */}
            {storageGroups.length > 0 && (
                <div className={styles.variantSection}>
                    <p className={styles.sectionLabel}>Select Variant</p>
                    <div className={styles.storagePills}>
                        {storageGroups.map(({ storage, rep }) => {
                            const price = minPriceForStorage(storage);
                            const isSelected = selectedStorage === storage;
                            return (
                                <button
                                    key={storage}
                                    className={`${styles.storagePill} ${isSelected ? styles.storagePillActive : ""}`}
                                    onClick={() => setSelectedVariant(rep)}
                                >
                                    <span className={styles.pillStorage}>{storage}</span>
                                    {/* {price > 0 && (
                                        <span className={styles.pillPrice}>from ₹{price.toLocaleString("en-IN")}</span>
                                    )} */}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* ── Select Colour ── */}
            {colorVariants.length > 0 && (
                <div className={styles.colorSection}>
                    <p className={styles.sectionLabel}>Select Colour</p>
                    <div className={styles.colorOptions}>
                        {colorVariants.map(v => (
                            <button
                                key={v.id}
                                className={`${styles.colorSwatch} ${selectedVariant?.id === v.id ? styles.colorSwatchActive : ""}`}
                                onClick={() => setSelectedVariant(v)}
                                title={v.color}
                            >
                                <span
                                    className={styles.colorCircle}
                                    style={{ backgroundColor: v.color_code || "#ccc" }}
                                />
                                <span className={styles.colorLabel}>{v.color}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* ── Condition ── */}
            <div className={styles.conditionSection}>
                <div className={styles.conditionHeader}>
                    <p className={styles.sectionLabel} style={{ margin: 0 }}>Condition</p>
                    <button className={styles.howItWorksBtn}>How it Works?</button>
                </div>
                <div className={styles.conditionOptions}>
                    <div className={`${styles.conditionBox} ${styles.conditionSelected}`}>
                        <span className={styles.conditionName}>Excellent</span>
                        <span className={styles.conditionDesc}>Like new, no visible signs of wear</span>
                    </div>
                    <div className={styles.conditionBox}>
                        <span className={styles.conditionName}>Very Good</span>
                        <span className={styles.conditionDesc}>Minor signs of use, rarely visible</span>
                    </div>
                    <div className={styles.conditionBox}>
                        <span className={styles.conditionName}>Good</span>
                        <span className={styles.conditionDesc}>Visible signs of use, fully functional</span>
                    </div>
                </div>
            </div>

            {/* ── EMI row ── */}
            <div className={styles.emiRow}>
                <FiCreditCard className={styles.emiIcon} />
                <span className={styles.emiText}>EMI from ₹1,028/month</span>
                <button className={styles.emiLink}>View Plans →</button>
            </div>
        </div>
    );
};

export default ProductInfotest;
