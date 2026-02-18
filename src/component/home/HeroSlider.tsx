"use client"
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

import "@/styles/HeroSlider.css";

const HeroSlider = () => {
  return (
    <div className="hero">
      <Swiper
        modules={[Navigation, Pagination, Autoplay, EffectFade]}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        loop={true}
        effect="fade"
        className="heroSwiper"
      >
        <SwiperSlide>
          <div className="slide">
            <img
              src="https://www.apple.com/newsroom/images/2025/09/apple-debuts-iphone-17/tile/Apple-iPhone-17-hero-250909-lp.jpg.landing-big_2x.jpg"
              alt="Slide 1"
            />
            <div className="hero-content">
              <h1>Premium iPhones. Smarter Prices.</h1>
              <p>Certified. Fully Tested. Warranty Included. Delivered to Your Door.</p>
              <div className="cta-section">
                <button className="cta-btn-buy">Buy</button>
                <button className="cta-btn-sell">Sell</button>
              </div>
            </div>
          </div>
        </SwiperSlide>

        <SwiperSlide>
          <div className="slide">
            <img
              src="https://mir-s3-cdn-cf.behance.net/project_modules/1400/f3832e180145769.6505ae76214ca.jpg"
              alt="Slide 2"
            />
            <div className="hero-content">
              <h1>Get the iPhone You Want. Pay Less.</h1>
              <p>Up to 40% lower than retail. Fully tested. Backed by warranty.</p>
              <div className="cta-section">
                <button className="cta-btn-buy">Buy</button>
                <button className="cta-btn-sell">Sell</button>
              </div>
            </div>
          </div>
        </SwiperSlide>

        <SwiperSlide>
          <div className="slide">
            <img
            src="https://www.apple.com/newsroom/images/2024/09/apple-debuts-iphone-16-pro-and-iphone-16-pro-max/tile/Apple-iPhone-16-Pro-hero-geo-240909-lp.jpg.landing-big_2x.jpg"
              alt="Slide 3"
            />
            <div className="hero-content">
              <h1>Certified iPhones. Better Prices.</h1>
              <p>Warranty Included. Free Delivery.</p>
              <div className="cta-section">
                <button className="cta-btn-buy">Buy</button>
                <button className="cta-btn-sell">Sell</button>
              </div>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

export default HeroSlider;
