"use client";
import React, { useState } from "react";

interface ProductGalleryProps {
  images: string[];
}

const ProductGallery: React.FC<ProductGalleryProps> = ({ images }) => {
  const [activeImage, setActiveImage] = useState(images[0]);

  return (
    <div className="gallery">
      <div className="main-image">
        <img src={activeImage} alt="product" />
      </div>

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