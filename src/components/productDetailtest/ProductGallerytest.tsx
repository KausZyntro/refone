"use client";

import React, { useState } from "react";
import Image from "next/image";
import styles from "./ProductGallerytest.module.css";
import { ProductTest, VariantTest } from "@/types/producttest";
import { FiHeart, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation, Thumbs, FreeMode } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import "swiper/css/free-mode";
import { IoIosRefresh } from "react-icons/io";
import { LuRefreshCcw } from "react-icons/lu";
import { FaTruckFast } from "react-icons/fa6";
import { FaCreditCard } from "react-icons/fa";

interface ProductGalleryTestProps {
    product: ProductTest;
    selectedVariant: VariantTest | null;
}

const ProductGallerytest: React.FC<ProductGalleryTestProps> = ({ product, selectedVariant }) => {
    const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);

    const images = selectedVariant?.images ?? [];

    return (
        <div className={styles.galleryRoot}>
            <div className={styles.galleryContainer}>
                {/* Main Slider */}
                <div className={styles.mainSliderArea}>
                    <button className={styles.wishlistBtn} aria-label="Add to wishlist">
                        <FiHeart size={18} />
                    </button>
                    
                    <Swiper
                        modules={[Pagination, Navigation, Thumbs]}
                        pagination={{ clickable: true, bulletClass: styles.bullet, bulletActiveClass: styles.bulletActive }}
                        navigation={{
                            prevEl: `.${styles.navBtnPrev}`,
                            nextEl: `.${styles.navBtnNext}`,
                        }}
                        thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                        className={styles.mainSwiper}
                        spaceBetween={10}
                    >
                        {images.length > 0 ? (
                            images.map((img, i) => (
                                <SwiperSlide key={img.id} className={styles.slide}>
                                    <div className={styles.imageWrap}>
                                        <Image
                                            src={img.image_url || "/placeholder.png"}
                                            alt={`${product?.name || "Product"} view ${i + 1}`}
                                            width={500}
                                            height={500}
                                            className={styles.mainImg}
                                            priority={i === 0}
                                        />
                                    </div>
                                </SwiperSlide>
                            ))
                        ) : (
                            <SwiperSlide className={styles.slide}>
                                <div className={styles.imageWrap}>
                                    <Image
                                        src="/placeholder.png"
                                        alt="Product fallback"
                                        width={500}
                                        height={500}
                                        className={styles.mainImg}
                                    />
                                </div>
                            </SwiperSlide>
                        )}

                        {/* Navigation Arrows (Optional, usually better for desktop) */}
                        <div className={`${styles.navBtn} ${styles.navBtnPrev}`}><FiChevronLeft /></div>
                        <div className={`${styles.navBtn} ${styles.navBtnNext}`}><FiChevronRight /></div>
                    </Swiper>
                </div>

                {/* Thumbnails Slider */}
                <div className={styles.thumbsArea}>
                    <Swiper
                        onSwiper={setThumbsSwiper}
                        spaceBetween={8}
                        slidesPerView={5}
                        freeMode={true}
                        watchSlidesProgress={true}
                        modules={[FreeMode, Navigation, Thumbs]}
                        className={styles.thumbSwiper}
                        direction="vertical"
                        breakpoints={{
                            0: { direction: 'horizontal', slidesPerView: 4 },
                            769: { direction: 'vertical', slidesPerView: 5 }
                        }}
                    >
                        {images.map((img) => (
                            <SwiperSlide key={img.id} className={styles.thumbSlide}>
                                <div className={styles.thumbWrap}>
                                    <Image
                                        src={img.image_url || "/placeholder.png"}
                                        alt="thumbnail"
                                        width={70}
                                        height={70}
                                        className={styles.thumbImg}
                                    />
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>

            {/* Trust strip (Visible only on Desktop in this component) */}
            <div className={styles.trustStrip}>
                <div className={styles.trustItem}>
                    <span className={styles.trustIcon}><LuRefreshCcw/></span>
                    <div>
                        <span className={styles.trustTitle}>7 Days Return</span>
                        <span className={styles.trustDesc}>Not satisfied? Return it easily</span>
                    </div>
                </div>
                <div className={styles.trustDivider} />
                <div className={styles.trustItem}>
                    <span className={styles.trustIcon}><FaTruckFast /></span>
                    <div>
                        <span className={styles.trustTitle}>Free Delivery</span>
                        <span className={styles.trustDesc}>Fast & secure delivery</span>
                    </div>
                </div>
                <div className={styles.trustDivider} />
                <div className={styles.trustItem}>
                    <span className={styles.trustIcon}><FaCreditCard /></span>
                    <div>
                        <span className={styles.trustTitle}>Pay on Delivery</span>
                        <span className={styles.trustDesc}>COD available</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductGallerytest;
