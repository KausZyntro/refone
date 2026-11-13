"use client";

import { useState } from "react";
import Image from "next/image";

interface BlogCardImageProps {
  src: string;
  alt: string;
  className: string;
}

export default function BlogCardImage({ src, alt, className }: BlogCardImageProps) {
  const [imageError, setImageError] = useState(false);

  if (!src || imageError) {
    return (
      <div
        className={className}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#999",
          backgroundColor: "#e9ecef",
        }}
      >
        No Image
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes="(max-width: 768px) 100vw, (max-width: 992px) 50vw, 33vw"
      className={className}
      onError={() => setImageError(true)}
    />
  );
}
