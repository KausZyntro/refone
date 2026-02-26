"use client";
import React, { useState } from "react";
import "@/styles/AuthModal.css";
import Lottie from "lottie-react";
import animationData from "../../../public/lottie/shopping-cart.json";

const AuthModal = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="auth-backdrop">
      <div className="auth-modal">
        
        {/* LEFT SIDE (Lottie Space) */}
        <div className="auth-left">
          <Lottie
            animationData={animationData}
            loop={true}
            className="auth-lottie"
          />
        </div>

        {/* RIGHT SIDE */}
        <div className="auth-right">
          <button className="auth-close" onClick={onClose}>×</button>

          <h2 className="auth-title">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h2>

          {/* FORM */}
          <form className="auth-form">
            
            {!isLogin && (
              <input
                type="text"
                placeholder="Full Name"
                className="auth-input"
              />
            )}

            <input
              type="text"
              placeholder={isLogin ? "Email / Mobile Number" : "Email"}
              className="auth-input"
            />

            <input
              type="password"
              placeholder="Password"
              className="auth-input"
            />

            {!isLogin && (
              <input
                type="password"
                placeholder="Confirm Password"
                className="auth-input"
              />
            )}

            <button type="submit" className="auth-btn">
              {isLogin ? "Login" : "Register"}
            </button>
          </form>

          {/* TOGGLE */}
          <p className="auth-toggle">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <span onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? " Register" : " Login"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;