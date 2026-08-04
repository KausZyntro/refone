"use client"
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "@/styles/PhoneDetail.css";

const categories = [
  {
    name: "iPhone 15 Pro",
    id: "2",
    slug: "iphone-15-pro",
    img: "/images/iphone15pro.webp",
  },
  {
    name: "iPhone 15 Plus",
    id: "3",
    slug: "iphone-15-plus",
    img: "/images/iphone15plus.jpeg",
  },
  {
    name: "iPhone 15",
    id: "4",
    slug: "iphone-15",
    img: "/images/iPhone15Pink.webp",
  },
  {
    name: "iPhone 14 Pro Max",
    id: "5",
    slug: "iphone-14-pro-max",
    img: "/images/iphone14promax.webp",
  },
  {
    name: "iPhone 14 Pro",
    id: "6",
    slug: "iphone-14-pro",
    img: "/images/iPhone14Pro.jpg",
  },
  {
    name: "iPhone 14",
    id: "7",
    slug: "iphone-14",
    img: "/images/iPhone14.jpg",
  },
  {
    name: "iPhone 13 Pro",
    id: "18",
    slug: "iphone-13-pro",
    img: "/images/iphone15plus.jpeg",
  },
  {
    name: "iPhone 13",
    id: "8",
    slug: "iphone-13",
    img: "/images/iphone131.jpg",
  },
];

const PhoneDetailSlider = () => {
  return (
    <section className="category-section">
      <div className="category-header">
        <h2>Shop By Category</h2>
        <a href="/allProduct" className="view-all-link">View All</a>
      </div>

      <div className="category-slider-container">
        <Swiper
          modules={[Navigation, Autoplay]}
          navigation={{
            nextEl: ".category-swiper-button-next",
            prevEl: ".category-swiper-button-prev",
          }}
          autoplay={{
            delay: 4000,
            disableOnInteraction: true,
            pauseOnMouseEnter: true,
          }}
          spaceBetween={24}
          slidesPerView={6}
          breakpoints={{
            320: {
              slidesPerView: 2.2,
              spaceBetween: 12,
            },
            480: {
              slidesPerView: 3.2,
              spaceBetween: 16,
            },
            768: {
              slidesPerView: 4.2,
              spaceBetween: 20,
            },
            1024: {
              slidesPerView: 5.2,
              spaceBetween: 24,
            },
            1200: {
              slidesPerView: 6,
              spaceBetween: 24,
            },
          }}
          className="category-swiper"
        >
          {categories.map((cat, index) => (
            <SwiperSlide key={index}>
              <a
                href={`/product/${cat.id}/${cat.slug}`}
                className="category-item"
              >
                <div className="category-icon-wrapper">
                  <img src={cat.img} alt={cat.name} />
                </div>
                <p className="category-name">{cat.name}</p>
              </a>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom Navigation Arrows */}
        <button className="category-swiper-button-prev" aria-label="Previous slide">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        <button className="category-swiper-button-next" aria-label="Next slide">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>
    </section>
  );
};

export default PhoneDetailSlider;
