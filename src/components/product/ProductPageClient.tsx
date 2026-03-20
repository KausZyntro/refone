"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { clearProduct, fetchProductById } from "@/redux/features/productSlice";

import ProductGallery from "@/components/product/ProductGallery";
import ProductInfo from "@/components/product/ProductInfo";
import ProductSlider from "@/components/home/ProductSlider";
import TrustBadge from "@/components/product/TrustBadge";
import ReviewsSection from "@/components/product/ReviewSection";

interface ProductPageClientProps {
    productId: string;
}

const ProductPageClient: React.FC<ProductPageClientProps> = ({ productId }) => {
    const dispatch = useDispatch<AppDispatch>();
    const { product, isLoading, error } = useSelector(
        (state: RootState) => state.product,
    );

    useEffect(() => {
        dispatch(fetchProductById(productId));

        // clear stale data when navigating away
        return () => {
            dispatch(clearProduct());
        };
    }, [dispatch, productId]);

    /* ── Loading ─────────────────────────────────────────────────── */
    if (isLoading) {
        return (
            <div className="product-loading">
                <div className="product-skeleton">
                    <div className="skeleton-gallery" />
                    <div className="skeleton-info">
                        <div className="skeleton-line wide" />
                        <div className="skeleton-line medium" />
                        <div className="skeleton-line short" />
                    </div>
                </div>
            </div>
        );
    }

    /* ── Error ───────────────────────────────────────────────────── */
    if (error) {
        return (
            <div className="product-error">
                <h2>Oops! Couldn&apos;t load product.</h2>
                <p>{error}</p>
            </div>
        );
    }

    /* ── No data yet ─────────────────────────────────────────────── */
    if (!product) return null;

    const images: string[] = product.variants?.flatMap(
        (v: any) => v.images?.map((img: any) => img.image_url) ?? [],
    ) ?? [];

    return (
        <div className="product-detail-container">
            <div className="product-top">
                <ProductGallery images={images} />
                <ProductInfo product={product} />
            </div>

            {/* ── Key Specifications — full-width below gallery+info ── */}
            <div className="specs-section">
                <h3 className="specs-title">Key Specifications</h3>
                <ul className="specs-list">
                    {product.screen_size && (
                        <li><span>Screen Size</span><span>{product.screen_size}</span></li>
                    )}
                    {product.battery_capacity && (
                        <li><span>Battery</span><span>{product.battery_capacity}</span></li>
                    )}
                    {product.front_camera && (
                        <li><span>Front Camera</span><span>{product.front_camera}</span></li>
                    )}
                    {product.back_camera && (
                        <li><span>Rear Camera</span><span>{product.back_camera}</span></li>
                    )}
                    {product.network_support && (
                        <li><span>Network</span><span>{product.network_support}</span></li>
                    )}
                    {product.sim_slots && (
                        <li><span>SIM Slots</span><span>{product.sim_slots}</span></li>
                    )}
                    {product.fingerprint_scanner !== undefined && (
                        <li><span>Fingerprint Scanner</span><span>{product.fingerprint_scanner ? "Yes" : "No"}</span></li>
                    )}
                    {product.face_unlock !== undefined && (
                        <li><span>Face Unlock</span><span>{product.face_unlock ? "Yes" : "No"}</span></li>
                    )}
                </ul>
            </div>

            {/* Campaign sliders – shows related / trending products */}
            <ProductSlider />

            <TrustBadge />
            <ReviewsSection />
        </div>
    );
};

export default ProductPageClient;
