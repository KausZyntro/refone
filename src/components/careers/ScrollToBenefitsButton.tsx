"use client";

import type { ReactNode } from "react";

interface ScrollToBenefitsButtonProps {
  className: string;
  children: ReactNode;
}

export default function ScrollToBenefitsButton({
  className,
  children,
}: ScrollToBenefitsButtonProps) {
  return (
    <button
      className={className}
      onClick={() => document.getElementById('benefits')?.scrollIntoView({ behavior: 'smooth' })}
    >
      {children}
    </button>
  );
}
