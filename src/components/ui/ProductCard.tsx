import React from "react";
import "@/styles/ProductCard.css";
import Link from "next/link";

const ProductCard = ({ product }: { product: any }) => {
  const discount =
    product.mrp && product.price
      ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
      : null;

  return (
    <Link href={`/product/${product.id || product.slug || ""}`}>
      <div className="product-card">
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
      </div>
    </Link>
  );
};

export default ProductCard;

