"use client";
import React, { useEffect, useState, useMemo } from "react";
import Lottie from "lottie-react";
import animationData from "../../../public/lottie/Network.json";
import "@/styles/FallbackPage.css";

export default function FallbackPage() {
  const texts = useMemo(() => [
    "System Overload",
    "Massive Demand Surge",
    "Users Are Buying Fast",
    "You're Almost In... ",
  ], []);

  const [displayText, setDisplayText] = useState("");
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentText = texts[textIndex];
    let timeout: NodeJS.Timeout;

    if (!isDeleting && charIndex < currentText.length) {
      // Typing
      timeout = setTimeout(() => {
        setDisplayText((prev) => prev + currentText[charIndex]);
        setCharIndex(charIndex + 1);
      }, 70);
    } else if (isDeleting && charIndex > 0) {
      // Deleting
      timeout = setTimeout(() => {
        setDisplayText((prev) => prev.slice(0, -1));
        setCharIndex(charIndex - 1);
      }, 40);
    } else if (!isDeleting && charIndex === currentText.length) {
      // Pause before deleting
      timeout = setTimeout(() => setIsDeleting(true), 2000);
    } else if (isDeleting && charIndex === 0) {
      // Next word
      setIsDeleting(false);
      setTextIndex((prev) => (prev + 1) % texts.length);
    }

    return () => clearTimeout(timeout);
  }, [charIndex, textIndex, isDeleting, texts]);

  return (
    <div className="fallback-container">
      <div className="fallback-card">
        <div className="fallback-animation">
          <Lottie 
            animationData={animationData} 
            loop={true} 
            style={{ width: '100%', height: '100%' }}
          />
        </div>

        <h1 className="fallback-typewriter">{displayText}<span className="cursor">|</span></h1>

        <p className="fallback-subtext">
          We’re currently experiencing traffic far beyond our expectations as an overwhelming number of users are actively making purchases.
        </p>

        <p className="fallback-secondary">
          Estimated wait time: less than a minute.
        </p>

        <p className="fallback-fun">We're adding more hamsters to the wheels 🐹</p>

        <button
          className="fallback-retry"
          onClick={() => window.location.reload()}
        >
          Refresh Connection
        </button>
      </div>
      
      <style jsx>{`
        .cursor {
          display: inline-block;
          margin-left: 2px;
          animation: blink 1s step-end infinite;
          color: #0369a1;
        }
        @keyframes blink {
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}