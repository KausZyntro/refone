'use client';

import React from 'react';
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
    const displaySpecs = `${firstVariant?.storage || ''} | ${firstVariant?.color || ''} | ${firstVariant?.grade || ''}`;

    const [selectedVariant, setSelectedVariant] = React.useState<VariantTest | null>(firstVariant || null);

    return (
        <div className={styles.productCard}>
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

                {/* price display correct */}
                <p className={styles.productPrice}>₹{Number(displayPrice).toLocaleString('en-IN')}</p>
                 {/* <span className={styles.sellingPrice}>
                    ₹XXXX
                    </span> */}

                <AddToCartSectiontest
                    product={product}
                    selectedVariant={selectedVariant}
                    showWishlist={false}
                    showBuyNow={false}
                />
            </div>
        </div>
    );
};

// Import Link as it's used in the template
import Link from 'next/link';

export default ProductCard;
