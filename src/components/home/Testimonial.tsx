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
  name: "Rohit Kapoor",
  location: "Mumbai",
  text: "I purchased a refurbished iPhone 15 and it arrived in excellent condition. The phone looked almost brand new and performance has been flawless so far.",
  image: "/images/useIcon.png",
},
{
  name: "Ananya Verma",
  location: "Pune",
  text: "The ordering process was smooth and delivery was faster than expected. The iPhone was exactly as described on the website.",
  image: "/images/useIcon.png",
},
{
  name: "Vikram Arora",
  location: "Gurugram",
  text: "Battery health was better than I expected and the device had no visible scratches. Great value for the price.",
  image: "/images/useIcon.png",
},
{
  name: "Sneha Iyer",
  location: "Chennai",
  text: "I was initially hesitant about buying a refurbished phone, but the quality exceeded my expectations. Very satisfied with my purchase.",
  image: "/images/useIcon.png",
},
{
  name: "Aditya Mishra",
  location: "Lucknow",
  text: "The iPhone was properly packed and came with all the essentials. Setup was easy and the device works perfectly.",
  image: "/images/useIcon.png",
},
{
  name: "Neha Gupta",
  location: "Jaipur",
  text: "Excellent customer support throughout the purchase process. The phone condition matched the grading mentioned on the product page.",
  image: "/images/useIcon.png",
},
{
  name: "Kunal Bhatia",
  location: "New Delhi",
  text: "Got an iPhone 14 at a great price. The device feels premium and there have been no issues with performance or battery life.",
  image: "/images/useIcon.png",
},
{
  name: "Priyanka Reddy",
  location: "Hyderabad",
  text: "The whole experience was hassle-free. From placing the order to receiving the phone, everything was handled professionally.",
  image: "/images/useIcon.png",
}
];

const Testimonial = () => {
  return (
    <div className="testimonial-section">
      <h2 className="section-title">Don’t Just Take Our Word for It — Hear From Our Happy Clients</h2>

      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={20}
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
