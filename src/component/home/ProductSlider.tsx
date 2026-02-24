"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

import ProductCard from "@/component/ui/ProductCard";

const ProductSlider = ({ products }) => {
  return (
    <div className="container">
      <header className="product-card-header">
        <h1>Trending</h1>
      </header>
      <Swiper
        modules={[Navigation]}
        spaceBetween={20}
        navigation
        breakpoints={{
          320: { slidesPerView: 1.1, spaceBetween: 12 },
          480: { slidesPerView: 2, spaceBetween: 15 },
          768: { slidesPerView: 2.5, spaceBetween: 20 },
          1024: { slidesPerView: 3.5, spaceBetween: 25 },
          1280: { slidesPerView: 4, spaceBetween: 30 },
          1440: { slidesPerView: 4.5, spaceBetween: 30 },
        }}
      >
        {products.map((product) => (
          <SwiperSlide key={product.id}>
            <ProductCard product={product} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ProductSlider;