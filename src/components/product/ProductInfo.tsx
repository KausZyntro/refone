"use client";
import React, { useState } from "react";
import { BsCreditCard2Front } from "react-icons/bs";
import { CiBank } from "react-icons/ci";
import { FaRegCreditCard, FaRupeeSign, FaTruck } from "react-icons/fa6";
import { MdPayment } from "react-icons/md";

interface Pricing {
  mrp: string;
  selling_price: string;
}

interface Variant {
  id: number;
  pricing: Pricing;
  inventory: { total_stock: number };
  images: { id: number; image_url: string }[];
}

interface ProductInfoProps {
  product: {
    id: number;
    name: string;
    screen_size?: string;
    battery_capacity?: string;
    front_camera?: string;
    back_camera?: string;
    network_support?: string;
    sim_slots?: string;
    fingerprint_scanner?: number;
    face_unlock?: number;
    brand?: { id: number; name: string };
    variants: Variant[];
  };
}

const ProductInfo: React.FC<ProductInfoProps> = ({ product }) => {
  const [selectedVariant, setSelectedVariant] = useState<Variant>(
    product.variants?.[0],
  );

  const pricing = selectedVariant?.pricing;
  const mrp = pricing ? parseFloat(pricing.mrp) : 0;
  const price = pricing ? parseFloat(pricing.selling_price) : 0;
  const discount = mrp && price ? Math.round(((mrp - price) / mrp) * 100) : 0;
  const stock = selectedVariant?.inventory?.total_stock ?? 0;

  return (
    <div className="product-info">
      <p className="category">
        {product.brand?.name} &bull; {product.network_support ?? ""}
      </p>

      <h1 className="title">{product.name}</h1>

      <div className="price-row">
        <span className="new-price">₹{price.toLocaleString("en-IN")}</span>
        {mrp > price && (
          <span className="old-price">₹{mrp.toLocaleString("en-IN")}</span>
        )}
        {discount > 0 && (
          <span className="discount-badge">{discount}% off</span>
        )}
      </div>

      {stock > 0 ? (
        <p className="stock-status in-stock">✔ In Stock ({stock} units)</p>
      ) : (
        <p className="stock-status out-of-stock">✘ Out of Stock</p>
      )}

      {/* Variant selector (if multiple variants) */}
      {product.variants.length > 1 && (
        <div className="storage-section">
          <div className="storage-header">
            <p>
              Variant: <b>#{selectedVariant?.id}</b>
            </p>
          </div>
          <div className="storages">
            {product.variants.map((v) => (
              <button
                key={v.id}
                className={
                  selectedVariant?.id === v.id ? "storage active" : "storage"
                }
                onClick={() => setSelectedVariant(v)}
              >
                Variant {v.id}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Specs */}
      <div className="specs-section">
        <h3 className="specs-title">Key Specifications</h3>
        <ul className="specs-list">
          {product.screen_size && (
            <li>
              <span>Screen Size</span>
              <span>{product.screen_size}</span>
            </li>
          )}
          {product.battery_capacity && (
            <li>
              <span>Battery</span>
              <span>{product.battery_capacity}</span>
            </li>
          )}
          {product.front_camera && (
            <li>
              <span>Front Camera</span>
              <span>{product.front_camera}</span>
            </li>
          )}
          {product.back_camera && (
            <li>
              <span>Rear Camera</span>
              <span>{product.back_camera}</span>
            </li>
          )}
          {product.network_support && (
            <li>
              <span>Network</span>
              <span>{product.network_support}</span>
            </li>
          )}
          {product.sim_slots && (
            <li>
              <span>SIM</span>
              <span>{product.sim_slots}</span>
            </li>
          )}
          {product.fingerprint_scanner !== undefined && (
            <li>
              <span>Fingerprint</span>
              <span>{product.fingerprint_scanner ? "Yes" : "No"}</span>
            </li>
          )}
          {product.face_unlock !== undefined && (
            <li>
              <span>Face Unlock</span>
              <span>{product.face_unlock ? "Yes" : "No"}</span>
            </li>
          )}
        </ul>
      </div>

      {/* Payment Methods */}
      <section className="payment-section">
        <h3 className="payment-title">Available Payment Methods</h3>
        <div className="payment-wrapper">
          <div className="payment-item">
            <div className="icon-box">
              <MdPayment />
            </div>
            <span>EMI</span>
          </div>
          <div className="payment-item">
            <div className="icon-box">
              <img
                src="https://s3ng.cashify.in/estore/08af477c2db941be8ba3c9848418acbb.webp"
                alt="UPI"
              />
            </div>
            <span>UPI</span>
          </div>
          <div className="payment-item">
            <div className="icon-box">
              <BsCreditCard2Front />
            </div>
            <span>Credit Card</span>
          </div>
          <div className="payment-item">
            <div className="icon-box">
              <FaTruck />
            </div>
            <span>COD Available</span>
          </div>
          <div className="payment-item">
            <div className="icon-box">
              <FaRupeeSign />
            </div>
            <span>Split Payment</span>
          </div>
          <div className="payment-item">
            <div className="icon-box">
              <FaRegCreditCard />
            </div>
            <span>Debit Card</span>
          </div>
          <div className="payment-item">
            <div className="icon-box">
              <CiBank />
            </div>
            <span>Net Banking</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductInfo;
