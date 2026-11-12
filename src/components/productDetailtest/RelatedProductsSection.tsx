"use client";

import React, { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import ProductCard from "@/app/allProduct/components/ProductCard";
import { productAPI } from "@/services/api";
import styles from "./ProductDetailTestPage.module.css";

interface RelatedProductsSectionProps {
    productId: number | string;
    productName: string;
}

/**
 * "Product you may like" carousel. It sits below the fold, so its JS bundle is
 * split out (see the dynamic import in ProductDetailTestPage) and the API call
 * only fires once the section is close to the viewport.
 */
const RelatedProductsSection: React.FC<RelatedProductsSectionProps> = ({ productId, productName }) => {
    const [products, setProducts] = useState<any[]>([]);
    const [isNearViewport, setIsNearViewport] = useState(false);
    const containerRef = useRef<HTMLDivElement | null>(null);

    // Reset when navigating to another product.
    useEffect(() => {
        setProducts([]);
        setIsNearViewport(false);
    }, [productId]);

    useEffect(() => {
        const element = containerRef.current;
        if (!element) return;

        if (typeof IntersectionObserver === "undefined") {
            setIsNearViewport(true);
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries.some((entry) => entry.isIntersecting)) {
                    setIsNearViewport(true);
                    observer.disconnect();
                }
            },
            { rootMargin: "400px 0px" }
        );

        observer.observe(element);
        return () => observer.disconnect();
    }, [productId]);

    useEffect(() => {
        if (!isNearViewport || !productName) return;

        let cancelled = false;

        const loadRelatedProducts = async () => {
            try {
                const response = await productAPI.getRelatedProducts(productName);

                if (cancelled || !response?.success) return;

                setProducts(
                    response.pdata
                        .filter((item: any) => item.id !== productId)
                        .map((item: any) => ({
                            ...item,
                            variants: item.variants.length ? [item.variants[0]] : [],
                        }))
                );
            } catch (error) {
                console.error("Related products error:", error);
            }
        };

        loadRelatedProducts();

        return () => { cancelled = true; };
    }, [isNearViewport, productName, productId]);

    if (!products.length) {
        return <div ref={containerRef} />;
    }

    return (
        <div ref={containerRef} className={styles.relatedProductsSection}>
            <h2 className={styles.relatedTitle}>Product you may like</h2>

            <Swiper
                slidesPerView={2}
                spaceBetween={16}
                breakpoints={{
                    768: {
                        slidesPerView: 3,
                    },
                    1024: {
                        slidesPerView: 4,
                        spaceBetween: 16,
                    },
                    1280: {
                        slidesPerView: 5,
                        spaceBetween: 18,
                    },
                    1440: {
                        slidesPerView: 6,
                        spaceBetween: 20,
                    },
                }}
            >
                {products.map((product) => (
                    <SwiperSlide key={`${product.id}-${product.variants[0]?.id || 0}`}>
                        <ProductCard product={product} />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default RelatedProductsSection;
