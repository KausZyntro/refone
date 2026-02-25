"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import "./animate.css";

gsap.registerPlugin(ScrollTrigger);

const ScrollImageSequence = () => {
  const containerRef = useRef(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const frameCount = 20;

  const images = Array.from(
    { length: frameCount },
    (_, i) => `/images/img${i + 1}.webp`
  );

//   useEffect(() => {
//     const obj = { frame: 0 };

//     gsap.to(obj, {
//       frame: frameCount - 2,
//       snap: "frame",
//       ease: "none",
//       scrollTrigger: {
//         trigger: containerRef.current,
//         start: "top top",
//         end: "+=100",
//         scrub: 1,
//         pin: true,
//       },
//       onUpdate: () => {
//         if (imageRef.current) {
//           imageRef.current.src = images[Math.round(obj.frame)];
//         }
//       },
//     });
//   }, []);

useGSAP(() => {
  const obj = { frame: 0 };

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: containerRef.current,
      start: "top top",
      end: "+=2000",
      scrub: 1,
      pin: true,
    },
  });

  // 🔹 Part 1 — First 5 Frames
  tl.to(obj, {
    frame: 5, // yaha tak image chalegi
    snap: "frame",
    ease: "none",
    duration: 1,
    onUpdate: () => {
      if (imageRef.current) {
        imageRef.current.src = images[Math.round(obj.frame)];
      }
    },
  });

  tl.from(".sequence-title", {
    y: 100,
    opacity: 0,
    duration: 0.8,
  });

  tl.from(
    ".sequence-description",
    {
      y: 100,
      opacity: 0,
      duration: 0.8,
    },
    "-=0.5"
  );

  // 🔹 Part 3 — Remaining Frames Continue
  tl.to(obj, {
    frame: frameCount - 1,
    snap: "frame",
    ease: "none",
    duration: 2,
    onUpdate: () => {
      if (imageRef.current) {
        imageRef.current.src = images[Math.round(obj.frame)];
      }
    },
  });
}, { scope: containerRef });

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
      <div className="text-container">
        <h1 className="sequence-title">Scroll to Animate. This is a scroll-triggered image sequence animation using GSAP and</h1>
        <p className="sequence-description">
          This is a scroll-triggered image sequence animation using GSAP and
          ScrollTrigger.
        </p>
      </div>
    </section>
  );
};

export default ScrollImageSequence;