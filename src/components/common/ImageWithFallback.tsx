"use client";

import { useState } from "react";

interface ImageWithFallbackProps {
  src: string;
  fallbackSrc: string;
  alt: string;
  className: string;
}

export default function ImageWithFallback({
  src,
  fallbackSrc,
  alt,
  className,
}: ImageWithFallbackProps) {
  const [hasError, setHasError] = useState(false);

  return (
    <img src={hasError ? fallbackSrc : src} alt={alt} className={className} onError={() => setHasError(true)} />
  );
}
