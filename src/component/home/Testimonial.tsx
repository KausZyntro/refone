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
    name: "Tarun Singh Verma",
    location: "New Delhi",
    text: "Sold off my phone very easily and got the payment on the spot.",
    image:
      "https://s3bg.cashify.in/gpro/uploads/2020/02/12192629/Screenshot-1-1-1.jpg",
  },
  {
    name: "Karan Sharma",
    location: "Delhi NCR",
    text: "Well trained staff. Overall a positive experience.",
    image:
      "https://s3bg.cashify.in/gpro/uploads/2020/02/12192435/Person-1-1.jpg",
  },
  {
    name: "Satheesh Kumaram",
    location: "Bengaluru",
    text: "It was a wonderful experience with Cashify. I got a reasonable price for my product and their response was very quick! Good to see such a service available",
    image:
      "https://s3bg.cashify.in/gpro/uploads/2019/09/13044450/image-2-min-2.jpeg",
  },
  {
    name: "Kiran Kumar Balusu",
    location: "Hyderabad",
    text: "Customer support was polite & technician was experienced.",
    image:
      "https://s3bg.cashify.in/gpro/uploads/2019/09/13044447/1.2.3-min.jpeg",
  },
];

const Testimonial = () => {
  return (
    <div className="testimonial-section">
      <h2 className="section-title">Don’t Just Take Our Word for It — Hear From Our Happy Clients</h2>

      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={20}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000 }}
        breakpoints={{
          320: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
      >
        {testimonials.map((item, index) => (
          <SwiperSlide key={index}>
            <div className="testimonial-card">
                <Image src={"/comma.png"} width="40" height="35" alt="comma"/>
              <p className="testimonial-text">"{item.text}"</p>

              <div className="user-info">
                <img src={item.image} alt={item.name} />
                <div>
                  <h4>{item.name}</h4>
                  <span>{item.location}</span>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Testimonial;
