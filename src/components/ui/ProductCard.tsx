import React from "react";
import "@/styles/ProductCard.css";
import Link from "next/link";

const ProductCard = ({ product }) => {
  return (
    <Link href={`/product/${product.slug || ""}`} >
  <div className="product-card">
            <div className="product-image-section">
        <span className="wishlist">♡</span>

        <img
          src={product.image}
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

        
        <div className="price-wrapper">
        <span className="price-current">₹{product.price}</span>

        <div className="price-secondary">
            <span className="price-mrp">
            M.R.P: <s>₹{product.mrp}</s>
            </span>
            <span className="price-discount">({product.discount}% off)</span>
        </div>
        </div>


      </div>
  </div>
    </Link>
  );
};

export default ProductCard;
