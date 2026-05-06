import React from "react";
import "@/styles/RefoneProductCard.css";
import Link from "next/link";
import { FaRegHeart } from "react-icons/fa";

const RefoneProductCard = ({ product }: { product: any }) => {
  const discount =
    product.mrp && product.price
      ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
      : null;

  const stock = product.total_stock ?? 0;
  const inboundStock = product.inbound_stock ?? 0;
  const isActive = product.is_active === 1;
  const isOutOfStock = stock <= 0 && inboundStock <= 0 && !isActive;
  console.log(isOutOfStock)

  return (
    <Link href={`/product/${product.id || product.slug || ""}`} style={{ textDecoration: 'none' }}>
      <div className="refone-product-card-horizontal">
        <div className="card-left">
          <div className="product-image-container">
            <img
              src={product.image || '/placeholder.png'}
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
            {product.storage || "128GB"} • {product.color || "Starlight"}
          </p>
          
          <div className={`condition-tag ${(product.condition || "Excellent").toLowerCase()}`}>
            <span>{product.condition || "Excellent"}</span>
          </div>

          {isOutOfStock ? (
            <div className="price-row">
              <span className="current-price" style={{ color: '#d32f2f', fontSize: '0.9rem', fontWeight: '700' }}>Price updating soon</span>
            </div>
          ) : (
            <div className="price-row">
              <span className="current-price">₹{product.price?.toLocaleString()}</span>
              {product.mrp && (
                <span className="mrp-price">₹{product.mrp?.toLocaleString()}</span>
              )}
              {discount && (
                <span className="discount-tag">{discount}% OFF</span>
              )}
            </div>
          )}

          <div className="card-footer-row">
            {!isOutOfStock && <span className="emi-text">EMI from ₹{Math.round(product.price / 12).toLocaleString()}/m</span>}
            <div className="footer-divider"></div>
            <span className="warranty-text">12 Months Warranty</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default RefoneProductCard;
