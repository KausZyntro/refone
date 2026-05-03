import React from "react";
import "@/styles/RefoneProductCard.css";
import Link from "next/link";
import { FaRegHeart } from "react-icons/fa";

const RefoneProductCard = ({ product }: { product: any }) => {
  const discount =
    product.mrp && product.price
      ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
      : null;
      // console.log(product)

  return (
    <Link href={`/product/${product.id || product.slug || ""}`}>
      <div className="refone-product-card-horizontal">
        <div className="card-left">
          <div className="product-image-container">
            <img
              src={product.image}
              alt={product.name}
              className="card-image"
            />
          </div>
        </div>

        <div className="card-right">
          <div className="card-header-row">
            <h3 className="card-title">{product.name}</h3>
            <div className="wishlist-icon">
              <FaRegHeart />
            </div>
          </div>
          
          <p className="card-specs">
            {product.storage || "128GB"} • {product.color}
          </p>
          
          <div className="condition-tag">
            <span>{product.condition || "Excellent"}</span>
          </div>

          <div className="price-row">
            <span className="current-price">₹{product.price?.toLocaleString()}</span>
            {product.mrp && (
              <span className="mrp-price">₹{product.mrp?.toLocaleString()}</span>
            )}
            {discount && (
              <span className="discount-tag">{discount}% OFF</span>
            )}
          </div>

          <div className="card-footer-row">
            <span className="emi-text">EMI from ₹{Math.round(product.price / 12).toLocaleString()}/m</span>
            <span className="warranty-text">12 Months Warranty</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default RefoneProductCard;
