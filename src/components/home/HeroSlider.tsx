"use client"
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import Image from "next/image";

import "@/styles/HeroSlider.css";
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

const HERO_DESKTOP_SIZES = "(max-width: 768px) 1px, (max-width: 1440px) calc(100vw - 40px), 1360px";
const HERO_MOBILE_SIZES = "(max-width: 768px) calc(100vw - 20px), 1px";

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
              <Image
                src="/discounted.webp"
                alt="Discount Banner"
                width={1600}
                height={566}
                sizes={HERO_DESKTOP_SIZES}
                quality={70}
                priority
                className="hero-img-desktop"
              />
              <Image
                src="/discounted-mobile.webp"
                alt="Discount Banner"
                width={800}
                height={649}
                sizes={HERO_MOBILE_SIZES}
                quality={70}
                loading="eager"
                className="hero-img-mobile"
              />
            </Link>
          </SwiperSlide>
          
         <SwiperSlide>
          <Link href="/allProduct" className="deals-banner-slide">
            <Image
              src="/deals.webp"
              alt="Premium Phones"
              width={1360}
              height={480}
              sizes={HERO_DESKTOP_SIZES}
              quality={70}
              loading="lazy"
              className="hero-img-desktop"
            />
            <Image
              src="/deals-mobile.webp"
              alt="Premium Phones"
              width={370}
              height={300}
              sizes={HERO_MOBILE_SIZES}
              quality={70}
              loading="lazy"
              className="hero-img-mobile"
            />
          </Link>
        </SwiperSlide>

        <SwiperSlide>
            <Link href="/exchange-phone" className="sell-banner-slide">
              <Image
                src="/sell.webp"
                alt="Sell Banner"
                width={1600}
                height={565}
                sizes={HERO_DESKTOP_SIZES}
                quality={70}
                loading="lazy"
                className="hero-img-desktop"
              />
              <Image
                src="/sell-mobile.webp"
                alt="Sell Banner"
                width={555}
                height={450}
                sizes={HERO_MOBILE_SIZES}
                quality={70}
                loading="lazy"
                className="hero-img-mobile"
              />
            </Link>
        </SwiperSlide>

       
          
      </Swiper>
    </div>
  );
};

export default HeroSlider;
