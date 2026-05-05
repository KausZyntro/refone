import React from "react";
import "@/styles/ProductCard.css";
import styles from '@/app/allProduct/allProduct.module.css';
import Link from "next/link";

const ProductCard = ({ product }: { product: any }) => {
  const discount =
    product.mrp && product.price
      ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
      : null;

  const stock = product.total_stock ?? 0;
  const inboundStock = product.inbound_stock ?? 0;
  const isActive = product.is_active === 1;
  const isOutOfStock = stock <= 0 && inboundStock <= 0 && !isActive;

  return (
    <Link href={`/product/${product.id || product.slug || ""}`}>
      <div className={styles.productCard}>
            <div className={styles.productImageWrapper}>
                <img
                    src={product.image || '/placeholder.png'}
                    alt={product.name}
                    className={styles.productImage}
                />
            </div>
            <div className={styles.productDetails}>
                <h3 className={styles.productName}>{product.name}</h3>
                <p className={styles.productSpecs}>{product.specs}</p>
                
                {isOutOfStock ? (
                  <div className="price-wrapper">
                    <span className="price-current" style={{ color: '#d32f2f', fontSize: '0.9rem' }}>Updating soon</span>
                  </div>
                ) : (
                  product.price && (
                    <div className="price-wrapper">
                      <span className="price-current">₹{product.price}</span>
                      <div className="price-secondary">
                        {product.mrp && (
                          <span className="price-mrp">
                            M.R.P: <s>₹{product.mrp}</s>
                          </span>
                        )}
                        {discount !== null && (
                          <span className="price-discount">({discount}% off)</span>
                        )}
                      </div>
                    </div>
                  )
                )}
                <button className={styles.addToCartBtn} disabled={isOutOfStock}>
                  {isOutOfStock ? "Out of Stock" : "Add to Cart"}
                </button>
            </div>
        </div>
      {/* <div className="product-card">
        <div className="product-image-section">
          <span className="wishlist">♡</span>
          <img
            src={product.image || "/placeholder.png"}
            alt={product.name}
            className="product-image"
          />
        </div>

        <div className="product-details">
          <h2 className="product-title">{product.name}</h2>
          <span className="deal-badge">Limited Time Deal</span>

          <div className="rating-section">
            <span className="stars">★★★★☆</span>
            <span className="rating-number">{product.rating}</span>
          </div>

          {product.price && (
            <div className="price-wrapper">
              <span className="price-current">₹{product.price}</span>
              <div className="price-secondary">
                {product.mrp && (
                  <span className="price-mrp">
                    M.R.P: <s>₹{product.mrp}</s>
                  </span>
                )}
                {discount !== null && (
                  <span className="price-discount">({discount}% off)</span>
                )}
              </div>
            </div>
          )}
        </div>
      </div> */}
    </Link>
  );
};

export default ProductCard;

