"use client";

import { useState } from "react";
import Image from "next/image";

interface ImageWithFallbackProps {
  src: string;
  fallbackSrc: string;
  alt: string;
  width: number;
  height: number;
  sizes: string;
  className: string;
}

export default function ImageWithFallback({
  src,
  fallbackSrc,
  alt,
  width,
  height,
  sizes,
  className,
}: ImageWithFallbackProps) {
  const [hasError, setHasError] = useState(false);

  return (
    <Image src={hasError ? fallbackSrc : src} alt={alt} width={width} height={height} sizes={sizes} className={className} onError={() => setHasError(true)} />
  );
}
