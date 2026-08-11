"use client"
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "@/styles/Testimonial.css";
import Image from "next/image";

const testimonials = [
  {
    name: "Amit Sharma",
    text: "I sold my old iPhone through Refone and got the best price. The pickup was super easy and hassle-free.",
    image: "/images/useIcon.png",
  },
  {
    name: "Priya Singh",
    text: "Great experience! The device quality is excellent and delivery was fast. Highly recommend Refone to everyone.",
    image: "/images/useIcon.png",
  },
  {
    name: "Rohan Mehta",
    text: "Transparent process and trustworthy platform. I love that Refone also cares about the environment.",
    image: "/images/useIcon.png",
  },
  {
    name: "Neha Verma",
    text: "Upgrading my laptop was so simple with Refone. Best value for money!",
    image: "/images/useIcon.png",
  },
  {
    name: "Vikram Joshi",
    text: "Professional service and timely support. Will definitely use Refone again.",
    image: "/images/useIcon.png",
  }
];

const Testimonial = () => {
  return (
    <div className="testimonial-section">
      <div className="testimonial-header">
        <div className="title-wrapper">
          {/* <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="star-icon">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="#F9A825" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg> */}
          <h2 className="section-title">What Our Customers Say</h2>
        </div>
        {/* <a href="#" className="see-all">See All</a> */}
      </div>

      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={20}
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000 }}
        breakpoints={{
          320: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 4 },
        }}
        className="testimonial-swiper"
      >
        {testimonials.map((item, index) => (
          <SwiperSlide key={index}>
            <div className="testimonial-card">
              <div className="user-info">
                <img src={item.image} alt={item.name} />
                <h4>{item.name}</h4>
              </div>
              <p className="testimonial-text">{item.text}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Testimonial;
