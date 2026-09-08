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
import Link from "next/link";

// const WhyBuyCard = () => (
//   <div className="why-buy-card">
//     <h3>Why Buy From Refone?</h3>
//     <div className="why-item">
//       <FaCheckCircle className="why-icon" />
//       <div className="why-text">
//         <h4>100% Original Products</h4>
//         <p>No compromises on quality</p>
//       </div>
//     </div>
//     <div className="why-item">
//       <FaShieldAlt className="why-icon" />
//       <div className="why-text">
//         <h4>Best Price Guarantee</h4>
//         <p>Get the best value</p>
//       </div>
//     </div>
//     <div className="why-item">
//       <FaClock className="why-icon" />
//       <div className="why-text">
//         <h4>Easy EMI Options</h4>
//         <p>No cost EMI available</p>
//       </div>
//     </div>
//     <div className="why-item">
//       <FaTruck className="why-icon" />
//       <div className="why-text">
//         <h4>Fast & Free Delivery</h4>
//         <p>Across India</p>
//       </div>
//     </div>
//   </div>
// );

const HeroSlider = () => {
  return (
    <div className="container-hero">
      <Swiper
        modules={[Navigation, Pagination, Autoplay, EffectFade]}
        pagination={{ clickable: true }}
        autoplay={{ delay: 8000, disableOnInteraction: false }}
        loop={true}
        effect="fade"
        className="heroSwiper"
      >
        <SwiperSlide>
            <Link href="/allProduct" className="discount-banner-slide">
              <img
                src="/discounted.png"
                alt="Discount Banner"
              />
            </Link>
          </SwiperSlide>
          
         <SwiperSlide>
          <Link href="/allProduct" className="deals-banner-slide">
            <img
              src="/deals.png"
              alt="Premium Phones"
            />
          </Link>
        </SwiperSlide>

        <SwiperSlide>
            <Link href="/exchange-phone" className="sell-banner-slide">
              <img
                src="/sell.jpeg"
                alt="Sell Banner"
              />
            </Link>
        </SwiperSlide>

       
          
      </Swiper>
    </div>
  );
};

export default HeroSlider;
