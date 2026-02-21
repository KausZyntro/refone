"use client";
import React, { useState } from "react";
import { BsCreditCard2Front } from "react-icons/bs";
import { CiBank } from "react-icons/ci";
import { FaRegCreditCard, FaRupeeSign, FaTruck } from "react-icons/fa6";
import { MdPayment } from "react-icons/md";

const ProductInfo = () => {
  const [selectedSize, setSelectedSize] = useState("Fair");
  const [selectedStorage, setSelectedStorage] = useState("4 GB / 256 GB");
  const sizes = ["Fair", "Good", "Superb"];
  const storage = ["4 GB / 256 GB", "4 GB / 64 GB", "4 GB / 128 GB"];

  return (
    <div className="product-info">
      <p className="category">Apple • iPhone Series</p>

      <h1 className="title">Apple IPhone 17 Pro</h1>

      <div className="price-row">
        <span className="old-price">$536.00</span>
        <span className="new-price">$489.00</span>
      </div>

      <div className="rating">⭐⭐⭐⭐☆ (289 reviews)</div>

      <div className="description">
        iPhone 17 Pro Max is crafted from aerospace-grade titanium and powered
        by the A17 Pro chip. It delivers exceptional performance, an advanced
        camera system, and all-day battery life in a sleek, durable design.
      </div>
      <div className="storage-section">
        <div className="storage-header">
          <p>
            Size: <b>{selectedStorage}</b>
          </p>
        </div>
       <div className="storages">
          {storage.map((storage) => (
            <button
              key={storage}
              className={selectedStorage === storage ? "storage active" : "storage"}
              onClick={() => setSelectedStorage(storage)}
            >
              {storage}
            </button>
          ))}
        </div>
      </div>

      <div className="color-section">
        <p>
          Color: <b>Black</b>
        </p>
        <div className="color-options">
          <span className="color black active"></span>
          <span className="color gray"></span>
          <span className="color purple"></span>
          <span className="color navy"></span>
        </div>
      </div>

      <div className="size-section">
        <div className="size-header">
          <p>
            Size: <b>{selectedSize}</b>
          </p>
          {/* <span className="size-chart">View Size Chart</span> */}
        </div>

        <div className="sizes">
          {sizes.map((size) => (
            <button
              key={size}
              className={selectedSize === size ? "size active" : "size"}
              onClick={() => setSelectedSize(size)}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* <div className="button-row">
        <button className="add-cart">Add to Cart</button>
        <button className="buy-now">Buy Now</button>
      </div> */}

  

      <section className="payment-section">
  <h3 className="payment-title">Available Payment Methods</h3>

  <div className="payment-wrapper">
    
    <div className="payment-item">
      <div className="icon-box">
        <MdPayment/>
      </div>
      <span>EMI</span>
    </div>

    <div className="payment-item">
      <div className="icon-box">
        <img src="https://s3ng.cashify.in/estore/08af477c2db941be8ba3c9848418acbb.webp" alt="UPI"/>
      </div>
      <span>UPI</span>
    </div>

    <div className="payment-item">
      <div className="icon-box">
        <BsCreditCard2Front/>
      </div>
      <span>Credit Card</span>
    </div>

    <div className="payment-item">
      <div className="icon-box">
        <FaTruck/>
      </div>
      <span>COD Available</span>
    </div>

    <div className="payment-item">
      <div className="icon-box">
        <FaRupeeSign/>
      </div>
      <span>Split Payment</span>
    </div>

    <div className="payment-item">
      <div className="icon-box">
          <FaRegCreditCard/>
      </div>
      <span>Debit Card</span>
    </div>

    <div className="payment-item">
      <div className="icon-box">
        <CiBank/>
      </div>
      <span>Net Banking</span>
    </div>

  </div>
</section>
    </div>
  );
};

export default ProductInfo;
