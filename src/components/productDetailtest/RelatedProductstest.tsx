"use client";

import React from "react";
import Image from "next/image";
import styles from "./RelatedProductstest.module.css";
import { RelatedProductTest } from "@/types/producttest";

interface RelatedProductsTestProps {
    products: RelatedProductTest[];
}

const RelatedProductstest: React.FC<RelatedProductsTestProps> = ({ products }) => {
    return (
        <aside className={styles.relatedSection}>
            <h3 className={styles.sectionTitle}>You Might Also Like</h3>
            {products.map((product) => (
                <div key={product.id} className={styles.card}>
                    <Image
                        src={product.image}
                        alt={product.title}
                        width={70}
                        height={80}
                        className={styles.cardImage}
                    />
                    <div className={styles.cardInfo}>
                        <span className={styles.cardTitle}>{product.title}</span>
                        <span className={styles.cardSubtitle}>{product.subtitle}</span>
                        <span className={styles.cardPrice}>${product.price}</span>
                        <button className={styles.cardBtn}>Add to Cart</button>
                    </div>
                </div>
            ))}
        </aside>
    );
};

export default RelatedProductstest;
