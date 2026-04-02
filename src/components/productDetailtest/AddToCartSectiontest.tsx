"use client";

import React from "react";
import { FaHeart, FaShoppingCart, FaTruck, FaShieldAlt } from "react-icons/fa";
import styles from "./AddToCartSectiontest.module.css";

const AddToCartSectiontest: React.FC = () => {
    return (
        <div className={styles.addToCart}>
            <div className={styles.buttonRow}>
                <button className={styles.cartBtn}>
                    <FaShoppingCart /> Add to Cart
                </button>
                <button className={styles.wishlistBtn}>
                    <FaHeart /> Add to Wishlist
                </button>
            </div>

            <div className={styles.shippingInfo}>
                <FaTruck className={styles.shippingIcon} />
                <span>Free shipping on orders over $500</span>
            </div>

            <div className={styles.shippingInfo}>
                <FaShieldAlt className={styles.warrantyIcon} />
                <span>1-year warranty</span>
            </div>
        </div>
    );
};

export default AddToCartSectiontest;
