"use client";
import React, { useEffect, useState } from "react";
import Lottie from "lottie-react";
import animationData from "../../../public/lottie/Network.json";
import "@/styles/FallbackPage.css";

export default function FallbackPage() {
  const texts = [
    "System Overload...",
    "Too many users detected ⚡",
    "Stabilizing experience...",
  ];

  const [displayText, setDisplayText] = useState("");
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (charIndex < texts[textIndex].length) {
        setDisplayText((prev) => prev + texts[textIndex][charIndex]);
        setCharIndex(charIndex + 1);
      } else {
        setTimeout(() => {
          setDisplayText("");
          setCharIndex(0);
          setTextIndex((prev) => (prev + 1) % texts.length);
        }, 1500);
      }
    }, 50);

    return () => clearTimeout(timeout);
  }, [charIndex, textIndex, texts]);

  return (
    <div className="container">
      <div className="card">
        <div className="animation">
          <Lottie animationData={animationData} loop={true} />
        </div>

        <h1 className="typewriter">{displayText}</h1>

        <p className="subtext">
          Our servers are currently handling a massive surge in traffic.
          We\'re working hard to keep everything running smoothly.
        </p>

        <p className="secondary">
          Please hold on while we optimize your experience.
        </p>

        <p className="fun">Even robots need a moment to reboot 🤖</p>

        <button
          className="retry"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    </div>
  );
}