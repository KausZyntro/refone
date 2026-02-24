"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const ScrollImageSequence = () => {
  const containerRef = useRef(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const frameCount = 20;

  const images = Array.from(
    { length: frameCount },
    (_, i) => `/images/img${i + 1}.webp`
  );

  useEffect(() => {
    const obj = { frame: 0 };

    gsap.to(obj, {
      frame: frameCount - 2,
      snap: "frame",
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "+=100",
        scrub: 1,
        pin: true,
      },
      onUpdate: () => {
        if (imageRef.current) {
          imageRef.current.src = images[Math.round(obj.frame)];
        }
      },
    });
  }, []);



  return (
    <section
      ref={containerRef}
      style={{ height: "100vh", position: "relative" }}
    >
      <img
        ref={imageRef}
        src={images[0]}
        alt="sequence"
        className="sequence"
        style={{
          width: "100%",
          height: "100vh",
          objectFit: "cover",
          position: "sticky",
          top: 0,
        }}
      />
    </section>
  );
};

export default ScrollImageSequence;