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
      end: "+=500",
      scrub: 1,
      pin: true,
    },
  });

  tl.to(obj, {
    frame: frameCount - 1, 
    snap: "frame",
    ease: "none",
    duration: 3,
    onUpdate: () => {
      if (imageRef.current) {
        imageRef.current.src = images[Math.round(obj.frame)];
      }
    },
  },0);

// tl.from(".letter", {
//   // yPercent: 50,
//   opacity: 0,
//   stagger: 0.05,
//   ease: "power3.out",
//   duration: 0.5,
// },0);


// tl.to(".letter",{
//   color: "#ffffff",
//   stagger: 0.03,
//   duration: 1,
// },0.2)

const letters = gsap.utils.toArray(".letter") as HTMLElement[];

  letters.forEach((letter, i) => {
    tl.fromTo(letter,
      { opacity: 0, color: "#00ff00" }, 
      { opacity: 1, color: "#00ff00", duration: 0.3 },
      i * 0.05 
    );
    tl.to(letter,
      { color: "#ffffff", duration: 0.01 }, 
      i * 0.05 + 0.3 
    );
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
        <h1 className="sequence-title">{"Scroll to Animate. This is a scroll-triggered image sequence animation"
        .split("")
        .map((char, index)=>(
            <span key={index} className="letter">
                {char === " " ? "\u00A0" : char}
            </span>
        ))}</h1>
        <p className="sequence-description">
          This is a scroll-triggered image sequence animation using GSAP and
          ScrollTrigger.
        </p>
      </div>
    </section>
  );
};

export default ScrollImageSequence;