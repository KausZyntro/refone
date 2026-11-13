"use client";
import React, { useState, useRef } from "react";
import Image from "next/image";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

interface ProductGalleryProps {
  images: string[];
}

const ProductGallery: React.FC<ProductGalleryProps> = ({ images }) => {
  const [activeImage, setActiveImage] = useState(images?.[0] || "/placeholder.png");
  const [backgroundPosition, setBackgroundPosition] = useState("50% 50%");
  const [isZooming, setIsZooming] = useState(false);

  const imageRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;

    const { left, top, width, height } =
      imageRef.current.getBoundingClientRect();

    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;

    setBackgroundPosition(`${x}% ${y}%`);
  };

  return (
    <div className="gallery">
      <div
        className="main-image"
        ref={imageRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsZooming(true)}
        onMouseLeave={() => setIsZooming(false)}
        style={{
          backgroundImage: isZooming ? `url(${activeImage})` : "none",
          backgroundPosition: backgroundPosition,
          backgroundSize: isZooming ? "200%" : "100%",
        }}
      >
        <Image src={activeImage} alt="product" width={800} height={800} sizes="(max-width: 768px) 100vw, 50vw" className={isZooming ? "main-img hide" : "main-img"} />
      </div>

      <div className="thumbnail-row">
        {images.map((img, index) => (
          <div
            key={index}
            className={`thumb ${activeImage === img ? "active" : ""}`}
            onClick={() => setActiveImage(img)}
          >
            <Image src={img} alt="thumb" width={80} height={80} sizes="80px" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductGallery;