"use client";

import React from "react";
import Script from 'next/script';
import RatingStarstest from "@/components/common/RatingStarstest";
import styles from "./ProductInfotest.module.css";
import { ProductTest, VariantTest } from "@/types/producttest";
import { FiShield, FiCheckCircle, FiCreditCard } from "react-icons/fi";
import { LuRefreshCcw } from "react-icons/lu";
import { FaTruckFast } from "react-icons/fa6";
import { FaCreditCard, FaShieldAlt } from "react-icons/fa";
import styless from "./ProductGallerytest.module.css";
import SnapmintEMI from "../SnapmintLoader";


interface ProductInfoTestProps {
    product: ProductTest;
    selectedVariant: VariantTest | null;
    setSelectedVariant: (variant: VariantTest) => void;
}
interface SnapmintEMIProps {
    price: number;
}

 declare global {
    interface Window {
        loadOnPage?: () => void;
        snapOptions?: any;
        Snapmint?: any;
    }
}


// function SnapmintEMI({ price }: { price: number }) {
//   React.useEffect(() => {
//     let script = document.getElementById('snapmint-script') as HTMLScriptElement;
    
//     if (!script) {
//       script = document.createElement('script');
//       script.id = 'snapmint-script';
//       script.src = 'https://checkout-merchant.snapmint.com/js/v1/2025';
//       script.async = true;
//       script.onload = () => {
//         setTimeout(() => {
//           if (typeof window.loadOnPage === 'function') {
//             window.loadOnPage();
//           }
//         }, 300);
//       };
//       document.body.appendChild(script);
//     } else {
//       setTimeout(() => {
//         if (typeof window.loadOnPage === 'function') {
//           window.loadOnPage();
//         }
//       }, 300);
//     }
//   }, [price]);

//   return (
//     <div className="snapmint-emi-container" style={{ minHeight: '30px' }}>
//       <div className="snap_emi_txt"></div>
//       <span
//         className="snapmint_lowest_emi_value"
//         style={{ display: 'none' }}
//         data-snapmint-price={price}
//         data-snapmint-merchant_id="1439"
//         data-snapmintpage="products_page"
//       />
//     </div>
//   );
// }




const ProductInfotest: React.FC<ProductInfoTestProps> = ({ product, selectedVariant, setSelectedVariant }) => {

        const DeliveryBlock = () => (
        <div className={styles.deliveryBlock}>
            <p className={styles.deliveryTitle}>Check Estimated Delivery Date</p>
            <div className={styles.pincodeRow}>
                <input
                    className={styles.pincodeInput}
                    type="text"
                    placeholder="Enter Pincode"
                    maxLength={6}
                />
                <button className={styles.pincodeBtn}>Check</button>
            </div>
            <div className={styles.deliveryInfo}>
                <FiCheckCircle className={styles.deliveryCheckIcon} />
                <span>Usually delivered in 2-4 days</span>
            </div>
        </div>
    );
    
    /* ── Derived values ── */
    const selectedStorage = selectedVariant?.storage;

    const isVariantInStock = (v: VariantTest | null | undefined) => {
        if (!v) return false;
        // const stock = v?.inventory?.total_stock ?? 0;
        const stock = v?.inventory?.available_stock ?? 0;
        const inboundStock = v?.inventory?.inbound_stock ?? 0;
        const isActive = v?.inventory?.is_active === 1;
        return stock > 0 || inboundStock > 0 || isActive;
    };

    // Group variants by storage for pills
    const storageGroups = (product?.variants ?? []).reduce(
        (acc: { storage: string; rep: VariantTest; hasStock: boolean }[], v) => {
            const existing = acc.find(g => g.storage === v.storage);
            const inStock = isVariantInStock(v);
            if (!existing) {
                acc.push({ storage: v.storage, rep: v, hasStock: inStock });
            } else if (inStock && !existing.hasStock) {
                existing.hasStock = true;
                existing.rep = v; // Use an in-stock variant as representative
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

    /* ── Derived pricing values ── */
    const sellingPrice = Number(selectedVariant?.pricing?.selling_price ?? 0);
    const mrp = Number(selectedVariant?.pricing?.mrp ?? 0);
    const discountPct = mrp > 0 && sellingPrice > 0
        ? Math.round(((mrp - sellingPrice) / mrp) * 100) : 0;
    const isOutOfStock = !isVariantInStock(selectedVariant);

   

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

    const PricingBlock = () => (
        <div className={styles.pricingBlock}>
            {isOutOfStock ? (
                <p className={styles.sidebarOutOfStock}>Price Updating soon</p>
            ) : (
                <>
                    <div className={styles.sidebarPriceRow}>
                        <span className={styles.sidebarSellingPrice}>
                            ₹{sellingPrice.toLocaleString("en-IN")}
                        </span>
                       


                        {mrp > 0 && sellingPrice < mrp && (
                            <>
                                <span className={styles.sidebarMrp}>₹{mrp.toLocaleString("en-IN")}</span>
                                {discountPct > 0 && (
                                    <span className={styles.sidebarDiscount}>{discountPct}% OFF</span>
                                )}
                            </>
                        )}
                    </div>
                    <p className={styles.sidebarTaxNote}>Inclusive of all taxes</p>
                     {/* <SnapmintEMI price={sellingPrice} /> */}
                     <SnapmintEMI price={sellingPrice} page="products_page"/>

                </>
            )}
        </div>
    );

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
                    <span>52+ Quality Checks</span>
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

            <PricingBlock />

            <DeliveryBlock />

            <div className={styless.trustStrip}>
    <div className={styless.trustItem}>
        <span className={styless.trustIcon}><LuRefreshCcw /></span>
        <div>
            <span className={styless.trustTitle}>7 Days Replacement</span>
            <span className={styless.trustDesc}>Not satisfied? Replace it easily</span>
        </div>
    </div>

    <div className={styless.trustItem}>
        <span className={styless.trustIcon}><FaTruckFast /></span>
        <div>
            <span className={styless.trustTitle}>Fast Delivery</span>
            <span className={styless.trustDesc}>Fast & secure delivery</span>
        </div>
    </div>

    <div className={styless.trustItem}>
        <span className={styless.trustIcon}><FaCreditCard /></span>
        <div>
            <span className={styless.trustTitle}>Pay on Delivery</span>
            <span className={styless.trustDesc}>Coming soon</span>
        </div>
    </div>

    {/* 4th Box */}
    <div className={styless.trustItem}>
        <span className={styless.trustIcon}><FaShieldAlt /></span>
        <div>
            <span className={styless.trustTitle}>Secure Payment</span>
            <span className={styless.trustDesc}>100% secure checkout</span>
        </div>
    </div>
</div>


            {/* ── Select Variant (Storage pills) ── */}
            {/* {storageGroups.length > 0 && (
                <div className={styles.variantSection}>
                    <p className={styles.sectionLabel}>Select Variant</p>
                    <div className={styles.storagePills}>
                        {storageGroups.map(({ storage, rep, hasStock }) => {
                            const price = minPriceForStorage(storage);
                            const isSelected = selectedStorage === storage;
                            return (
                                <button
                                    key={storage}
                                    className={`${styles.storagePill} ${isSelected ? styles.storagePillActive : ""} ${!hasStock ? styles.outOfStock : ""}`}
                                    onClick={() => hasStock && setSelectedVariant(rep)}
                                    disabled={!hasStock}
                                >
                                    <span className={styles.pillStorage}>{storage}</span>
                                    
                                </button>
                            );
                        })}
                    </div>
                </div>
            )} */}

            {/* ── Select Colour ── */}
            {/* {colorVariants.length > 0 && (
                <div className={styles.colorSection}>
                    <p className={styles.sectionLabel}>Select Colour</p>
                    <div className={styles.colorOptions}>
                        {colorVariants.map(v => {
                            const inStock = isVariantInStock(v);
                            return (
                                <button
                                    key={v.id}
                                    className={`${styles.colorSwatch} ${selectedVariant?.id === v.id ? styles.colorSwatchActive : ""} ${!inStock ? styles.outOfStock : ""}`}
                                    onClick={() => inStock && setSelectedVariant(v)}
                                    title={inStock ? v.color : `${v.color} (Out of Stock)`}
                                    disabled={!inStock}
                                >
                                    <span
                                        className={styles.colorCircle}
                                        style={{ backgroundColor: v.color_code || "#ccc" }}
                                    />
                                    <span className={styles.colorLabel}>{v.color}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            )} */}

            {/* ── Condition ── */}
            {/* <div className={styles.conditionSection}>
                <div className={styles.conditionHeader}>
                    <p className={styles.sectionLabel} style={{ margin: 0 }}>Condition</p>
                    <button className={styles.howItWorksBtn}>How it Works?</button>
                </div>
                <div className={styles.conditionOptions}>
                    <div className={`${styles.conditionBox} ${styles.conditionSelected}`}>
                        <span className={styles.conditionName}>Excellent</span>
                        <span className={styles.conditionDesc}>Like new, no visible signs of wear</span>
                    </div>
                </div>
            </div> */}

            {/* ── EMI row ── */}
            <div className={styles.emiRow}>
                <FiCreditCard className={styles.emiIcon} />
                <span className={styles.emiText}>EMI (coming soon)</span>
                <button className={styles.emiLink}>View Plans →</button>
            </div>
        </div>
    );
};

export default ProductInfotest;
