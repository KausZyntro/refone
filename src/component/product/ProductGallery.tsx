"use client";
import React, { useState, useRef } from "react";

interface ProductGalleryProps {
  images: string[];
}

const ProductGallery: React.FC<ProductGalleryProps> = ({ images }) => {
  const [activeImage, setActiveImage] = useState(images?.[0] || "");
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
      {/* MAIN IMAGE */}
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
        <img
          src={activeImage}
          alt="product"
          className={`main-img ${isZooming ? "hide" : ""}`}
        />
      </div>

      {/* THUMBNAILS */}
      <div className="thumbnail-row">
        {images.map((img, index) => (
          <div
            key={index}
            className={`thumb ${activeImage === img ? "active" : ""}`}
            onClick={() => setActiveImage(img)}
          >
            <img src={img} alt="thumb" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductGallery;