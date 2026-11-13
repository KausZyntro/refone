"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

type LazyLottieProps = {
  src: string;
  className?: string;
  style?: React.CSSProperties;
};

/**
 * Loads both the Lottie player and its animation JSON on demand instead of
 * bundling them into the initial JavaScript. The JSON is served from /public
 * and cached by the browser.
 */
export default function LazyLottie({ src, className, style }: LazyLottieProps) {
  const [animationData, setAnimationData] = useState<object | null>(null);

  useEffect(() => {
    let active = true;
    const controller = new AbortController();

    fetch(src, { signal: controller.signal })
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (active && data) setAnimationData(data);
      })
      .catch(() => {
        // Non-critical decoration: leave the slot empty if it cannot load.
      });

    return () => {
      active = false;
      controller.abort();
    };
  }, [src]);

  if (!animationData) return null;

  return <Lottie animationData={animationData} loop className={className} style={style} />;
}
