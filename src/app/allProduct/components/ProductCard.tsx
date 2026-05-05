'use client';

import React from 'react';
import Link from 'next/link';
import styles from '../allProduct.module.css';
import AddToCartSectiontest from '@/components/productDetailtest/AddToCartSectiontest';
import { VariantTest } from '@/types/producttest';

interface ProductCardProps {
    product: any;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    // Extract first variant for display
    const firstVariant = product.variants?.[0];
    const displayImage = firstVariant?.images?.[0]?.image_url || '/placeholder.png';
    const displayPrice = firstVariant?.pricing?.selling_price || '0';
    const displayMrp = firstVariant?.pricing?.mrp || '0';
    
    
    // Calculate discount
    const mrp = Number(displayMrp);
    const sellingPrice = Number(displayPrice);
    const discount = mrp > sellingPrice ? Math.round(((mrp - sellingPrice) / mrp) * 100) : 0;

    const displaySpecs = `${firstVariant?.storage || ''} • ${firstVariant?.color || ''} • ${firstVariant?.grade || ''}`;

    const [selectedVariant, setSelectedVariant] = React.useState<VariantTest | null>(firstVariant || null);

    return (
        <div className={styles.productCard}>
            <div className={styles.cardHeader}>
                <span className={styles.bestsellerBadge}>Bestseller</span>
                <button className={styles.wishlistIconBtn} aria-label="Add to Wishlist">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                </button>
            </div>

            <Link href={`/product/${product.id}`} className={styles.imageLink}>
                <div className={styles.productImageWrapper}>
                    <img
                        src={displayImage}
                        alt={product.name}
                        className={styles.productImage}
                    />
                </div>
            </Link>
            <div className={styles.productDetails}>
                <Link href={`/product/${product.id}`} style={{ textDecoration: 'none' }}>
                    <h3 className={styles.productName}>{product.name}</h3>
                </Link>
                <p className={styles.productSpecs}>{displaySpecs}</p>

                <div className={styles.ratingRow}>
                    <span className={styles.stars}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                    </span>
                    <span className={styles.ratingScore}>4.6</span>
                    <span className={styles.ratingCount}>(12,458)</span>
                </div>

                {(() => {
                    // const stock = firstVariant?.inventory?.total_stock ?? 0;
                    // const inboundStock = firstVariant?.inventory?.inbound_stock ?? 0;
                    // const isActive = firstVariant?.inventory?.is_active === 1;
                    // const isOutOfStock = firstVariant?.inventory?.available_stock <= 0;
                    const stock = firstVariant?.inventory?.available_stock ?? 0;
                    const isOutOfStock = stock <= 0;
                    // console.log(firstVariant?.inventory?.available_stock);
                    // console.log(isOutOfStock);
                    return (
                        <>
                            <div className={styles.priceRow}>
                                {isOutOfStock ? (
                                    <span className={styles.productPrice} style={{ color: '#d32f2f', fontSize: '14px', fontWeight: '700' }}>Price updating soon</span>
                                ) : (
                                    <>
                                        <span className={styles.productPrice}>₹{sellingPrice.toLocaleString('en-IN')}</span>
                                        {discount > 0 && (
                                            <>
                                                <span className={styles.mrpPrice}>₹{mrp.toLocaleString('en-IN')}</span>
                                                <span className={styles.discountBadge}>{discount}% OFF</span>
                                            </>
                                        )}
                                    </>
                                )}
                            </div>
                            {!isOutOfStock && <p className={styles.emiText}>EMI from ₹1,028/m</p>}
                        </>
                    );
                })()}

                <div className={styles.cardFooter}>
                    <span className={styles.warrantyBadge}>12 Months Warranty</span>
                    <AddToCartSectiontest
                        product={product}
                        selectedVariant={selectedVariant}
                        showWishlist={false}
                        showBuyNow={false}
                        isIconOnly={true}
                    />
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
