"use client"
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import ActionCards from "@/components/home/ActionCards";

import "@/styles/HeroSlider.css";
import { FaMobileAlt, FaShoppingCart, FaCheckCircle, FaShieldAlt, FaUndo, FaTruck, FaClock } from "react-icons/fa";

const WhyBuyCard = () => (
  <div className="why-buy-card">
    <h3>Why Buy From Refone?</h3>
    <div className="why-item">
      <FaCheckCircle className="why-icon" />
      <div className="why-text">
        <h4>100% Original Products</h4>
        <p>No compromises on quality</p>
      </div>
    </div>
    <div className="why-item">
      <FaShieldAlt className="why-icon" />
      <div className="why-text">
        <h4>Best Price Guarantee</h4>
        <p>Get the best value</p>
      </div>
    </div>
    <div className="why-item">
      <FaClock className="why-icon" />
      <div className="why-text">
        <h4>Easy EMI Options</h4>
        <p>No cost EMI available</p>
      </div>
    </div>
    <div className="why-item">
      <FaTruck className="why-icon" />
      <div className="why-text">
        <h4>Fast & Free Delivery</h4>
        <p>Across India</p>
      </div>
    </div>
  </div>
);

const HeroSlider = () => {
  return (
    <div className="container-hero">
      <Swiper
        modules={[Navigation, Pagination, Autoplay, EffectFade]}
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop={true}
        effect="fade"
        className="heroSwiper"
      >
        <SwiperSlide>
          <div className="slide">
            <div className="hero-content">
              <h1>Premium Phones.<br /><span style={{ color: '#006aaf' }}>Priced Smarter.</span></h1>
              <p>Refurbished phones that are 100% original and come with warranty.</p>
              <div className="hero-stats-new">
                <div className="stat-item-new">
                  <div className="stat-icon"><FaCheckCircle /></div>
                  <span>32+ Quality Checks</span>
                </div>
                <div className="stat-item-new">
                  <div className="stat-icon"><FaShieldAlt /></div>
                  <span>12 Months Warranty</span>
                </div>
                <div className="stat-item-new">
                  <div className="stat-icon"><FaUndo /></div>
                  <span>7 Days Return</span>
                </div>
              </div>
              <button className="cta-btn-new" onClick={() => window.location.href = '/allProduct'}>Shop Phones</button>
            </div>
            <div className="hero-image">
               <img src="https://s3n.cashify.in/cashify/web/e9915873919b486f9166f272a2e411b3.png" alt="phones" />
            </div>
          </div>
        </SwiperSlide>

        <SwiperSlide>
          <div className="slide" style={{ background: 'linear-gradient(135deg, #fff3e0 0%, #ffffff 100%)' }}>
            <div className="hero-content">
              <h1>Sell Your Phone.<br /><span style={{ color: '#ff9800' }}>Best Price. Instantly.</span></h1>
              <p>Get the best value for your old smartphone. Free doorstep pickup and instant payment.</p>
              <div className="hero-stats-new">
                <div className="stat-item-new">
                  <div className="stat-icon" style={{ background: '#fff3e0', color: '#ff9800' }}><FaCheckCircle /></div>
                  <span>Instant Payment</span>
                </div>
                <div className="stat-item-new">
                  <div className="stat-icon" style={{ background: '#fff3e0', color: '#ff9800' }}><FaShieldAlt /></div>
                  <span>Safe & Secure</span>
                </div>
                <div className="stat-item-new">
                  <div className="stat-icon" style={{ background: '#fff3e0', color: '#ff9800' }}><FaTruck /></div>
                  <span>Free Pickup</span>
                </div>
              </div>
              <button className="cta-btn-new" style={{ background: '#ff9800', boxShadow: '0 4px 15px rgba(255, 152, 0, 0.3)' }} onClick={() => window.location.href = '/exchange-phone'}>Sell Now</button>
            </div>
            <div className="hero-image">
               <img src="https://s3n.cashify.in/cashify/web/83894411132646f990c765050f4a4c51.png" alt="sell" />
            </div>
          </div>
        </SwiperSlide>

        <SwiperSlide>
          <div className="slide" style={{ background: 'linear-gradient(135deg, #e3f2fd 0%, #ffffff 100%)' }}>
            <div className="hero-content">
              <h1>Check Your Phone's<br /><span style={{ color: '#2196f3' }}>Current Market Value.</span></h1>
              <p>Wondering how much your phone is worth? Check the latest price in just 60 seconds.</p>
              <div className="hero-stats-new">
                <div className="stat-item-new">
                  <div className="stat-icon" style={{ background: '#e3f2fd', color: '#2196f3' }}><FaCheckCircle /></div>
                  <span>Accurate Valuation</span>
                </div>
                <div className="stat-item-new">
                  <div className="stat-icon" style={{ background: '#e3f2fd', color: '#2196f3' }}><FaShieldAlt /></div>
                  <span>Data Privacy</span>
                </div>
                <div className="stat-item-new">
                  <div className="stat-icon" style={{ background: '#e3f2fd', color: '#2196f3' }}><FaClock /></div>
                  <span>Quick Process</span>
                </div>
              </div>
              <button className="cta-btn-new" style={{ background: '#2196f3', boxShadow: '0 4px 15px rgba(33, 150, 243, 0.3)' }} onClick={() => window.location.href = '/allProduct'}>Check Value</button>
            </div>
            <div className="hero-image">
               <img src="https://s3n.cashify.in/cashify/web/b5f45813359d43618f08139589994f31.png" alt="check" />
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
      <WhyBuyCard />
    </div>
  );
};

export default HeroSlider;
