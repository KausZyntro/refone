"use client";

import React from "react";
import Image from "next/image";
import { FaFacebookF, FaLinkedinIn, FaTwitter, FaYoutube, FaEnvelope } from "react-icons/fa";
import styles from "./ProductGallerytest.module.css";
import { ProductTest, VariantTest } from "@/types/producttest";

interface ProductGalleryTestProps {
    product: ProductTest;
    selectedVariant: VariantTest | null;
}

const ProductGallerytest: React.FC<ProductGalleryTestProps> = ({ product, selectedVariant }) => {
    const [activeImageIndex, setActiveImageIndex] = React.useState(0);

    // Reset image index when variant changes
    React.useEffect(() => {
        setActiveImageIndex(0);
    }, [selectedVariant]);

    const activeImage = selectedVariant?.images?.[activeImageIndex]?.image_url || "/fallback.png";

    return (
        <div className={styles.gallery}>
            <div className={styles.mainImageWrapper}>
                <Image
                    src={activeImage}
                    alt={product?.name || "Product Image"}
                    width={400}
                    height={480}
                    className={styles.mainImage}
                    priority
                />
            </div>

            {selectedVariant?.images && selectedVariant.images.length > 0 && (
                <div className={styles.thumbnails}>
                    {selectedVariant.images.map((img, index) => (
                        <div
                            key={img.id}
                            className={`${styles.thumbnailWrapper} ${activeImageIndex === index ? styles.activeThumb : ""}`}
                            onClick={() => setActiveImageIndex(index)}
                        >
                            <Image
                                src={ img?.image_url || "/fallback.png"}
                                alt={`Thumbnail ${index + 1}`}
                                width={60}
                                height={60}
                                className={styles.thumbnail}
                            />
                        </div>
                    ))}
                </div>
            )}

            <div className={styles.specList}>
                <div className={styles.specItem}>
                    <span className={styles.specLabel}>Brand: </span>
                    <span className={styles.specValue}>{product?.brand?.name}</span>
                </div>

                <div className={styles.specItem}>
                    <span className={styles.specLabel}>Display:</span>
                    <span className={styles.specValue}>{product?.screen_size}</span>
                </div>

                <div className={styles.specItem}>
                    <span className={styles.specLabel}>Processor:</span>
                    <span className={styles.specValue}>{product?.battery_capacity}</span>
                </div>

                <div className={styles.specItem}>
                    <span className={styles.specLabel}>Front Camera:</span>
                    <span className={styles.specValue}>{product?.front_camera}</span>
                </div>

                <div className={styles.specItem}>
                    <span className={styles.specLabel}>Network Support</span>
                    <span className={styles.specValue}>{product?.network_support}</span>
                </div>
            </div>

            <div className={styles.socialIcons}>
                <span className={`${styles.socialIcon} ${styles.facebook}`}>
                    <FaFacebookF />
                </span>
                <span className={`${styles.socialIcon} ${styles.linkedin}`}>
                    <FaLinkedinIn />
                </span>
                <span className={`${styles.socialIcon} ${styles.twitter}`}>
                    <FaTwitter />
                </span>
                <span className={`${styles.socialIcon} ${styles.youtube}`}>
                    <FaYoutube />
                </span>
                <span className={`${styles.socialIcon} ${styles.email}`}>
                    <FaEnvelope />
                </span>
            </div>
        </div>
    );
};

export default ProductGallerytest;
