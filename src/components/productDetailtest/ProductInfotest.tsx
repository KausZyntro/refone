"use client";

import React from "react";
import RatingStarstest from "@/components/common/RatingStarstest";
import styles from "./ProductInfotest.module.css";
import { ProductTest, VariantTest } from "@/types/producttest";

interface ProductInfoTestProps {
  product: ProductTest;
  selectedVariant: VariantTest | null;
  setSelectedVariant: (variant: VariantTest) => void;
}

const ProductInfotest: React.FC<ProductInfoTestProps> = ({ product, selectedVariant, setSelectedVariant }) => {
  // console.log(product)

  return (
    <div className={styles.productInfo}>
      <h1 className={styles.title}>
        <span className={styles.titleBrand}>{product?.brand?.name} </span>
        <span className={styles.titleModel}>{product?.name}</span>
      </h1>

      <div className={styles.ratingRow}>
        <RatingStarstest rating={4.5} reviewCount={128} />
      </div>

      <div className={styles.priceRow}>
        <span className={styles.sellingPrice}>₹{Number(selectedVariant?.pricing?.selling_price).toLocaleString("en-IN")}</span>
        {selectedVariant?.pricing?.mrp && (
          <span className={styles.mrp}>₹{Number(selectedVariant?.pricing?.mrp).toLocaleString("en-IN")}</span>
        )}
      </div>

      <div className={styles.stockBadge}>
        <span className={styles.stockDot}></span>
        {selectedVariant?.inventory?.total_stock && selectedVariant.inventory.total_stock > 0
          ? `In stock (${selectedVariant.inventory.total_stock} units)`
          : "Out of stock"}
      </div>

      {product?.variants && product.variants.length > 0 && (
        <div className={styles.variantSection}>
          <p className={styles.variantLabel}>
            Color: <strong>{selectedVariant?.color}</strong>
          </p>
          <div className={styles.colorOptions}>
            {product.variants.map((v) => (
              <button
                key={v.id}
                className={`${styles.colorCircle} ${selectedVariant?.id === v.id ? styles.active : ""}`}
                onClick={() => setSelectedVariant(v)}
                style={{
                  backgroundColor: v.color_code,
                }}
                title={v.color}
              />
            ))}
          </div>
        </div>
      )}

      <div className={styles.storageSection}>
        <p className={styles.variantLabel}>
          Storage: <strong>{selectedVariant?.storage}</strong>
        </p>
        <div className={styles.storageBadge}>
          {selectedVariant?.storage}
        </div>
      </div>
    </div>
  );
};

export default ProductInfotest;
