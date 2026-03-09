"use client";
import React, { useState, useRef } from "react";
import "@/styles/AuthModal.css";
import Lottie from "lottie-react";
import animationData from "../../../public/lottie/shopping-cart.json";

const OtpModal = ({
  isOpen,
  onClose,
  onVerify,
}: {
  isOpen: boolean;
  onClose: () => void;
  onVerify: (otp: string) => void;
}) => {

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  if (!isOpen) return null;

  const handleChange = (value: string, index: number) => {

    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = () => {
    const otpCode = otp.join("");

    if (otpCode.length !== 6) {
      alert("Enter valid 6 digit OTP");
      return;
    }

    onVerify(otpCode);
  };

  return (
    <div className="auth-backdrop">
      <div className="auth-modal">
        {/* LEFT SIDE (Lottie Space) */}
        <div className="auth-left">
          <Lottie
            animationData={animationData as any}
            loop={true}
            className="auth-lottie"
          />
        </div>

        {/* RIGHT SIDE */}
        <div className="auth-right">
          <button className="auth-close" onClick={onClose}>×</button>

          <h2 className="auth-title">OTP Verification</h2>

          <p className="otp-text" style={{ fontSize: '14px', marginBottom: '20px', textAlign: 'center' }}>
            Enter the 6 digit OTP sent to your email
          </p>

          <div className="otp-container">
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                className="otp-input"
                value={digit}
                ref={(el) => { inputs.current[index] = el; }}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
              />
            ))}
          </div>

          <button className="auth-btn" onClick={handleSubmit}>
            Verify OTP
          </button>
        </div>
      </div>
    </div>
  );
};

export default OtpModal;