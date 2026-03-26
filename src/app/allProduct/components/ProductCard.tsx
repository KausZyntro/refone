import React from 'react';
import styles from '../allProduct.module.css';
import { Product } from '../dummyData';

interface ProductCardProps {
    product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    return (
        <div className={styles.productCard}>
            <div className={styles.productImageWrapper}>
                <img
                    src={product.image}
                    alt={product.name}
                    className={styles.productImage}
                />
            </div>
            <div className={styles.productDetails}>
                <h3 className={styles.productName}>{product.name}</h3>
                <p className={styles.productSpecs}>{product.specs}</p>
                <p className={styles.productPrice}>₹{product.price}</p>
                <button className={styles.addToCartBtn}>Add to Cart</button>
            </div>
        </div>
    );
};

export default ProductCard;
