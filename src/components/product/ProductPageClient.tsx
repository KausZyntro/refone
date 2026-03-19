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

            {/* Campaign sliders – shows related / trending products */}
            <ProductSlider />

            <TrustBadge />
            <ReviewsSection />
        </div>
    );
};

export default ProductPageClient;
