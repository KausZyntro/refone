"use client";
import React, { useState, useEffect } from "react";
import "@/styles/AuthModal.css";
import Lottie from "lottie-react";
import animationData from "../../../public/lottie/shopping-cart.json";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, registerUser, clearError } from "@/redux/features/authSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { toast } from "react-toastify";

const AuthModal = ({ isOpen, onClose, openOtp, openForgotPassword }: { isOpen: boolean; onClose: () => void; openOtp: (userId: number) => void; openForgotPassword?: () => void }) => {
  const [isLogin, setIsLogin] = useState(true);
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error, token, registerSuccess } = useSelector((state: RootState) => state.auth);

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");

  // useEffect(() => {
  //   if (token) {
  //     onClose(); // Close modal on successful auth
  //   }
  // }, [token, onClose]);

  useEffect(() => {
    if (registerSuccess) {
      toast.success("Registration Successful! Please login.");
      setIsLogin(true);
    }
  }, [registerSuccess]);

  // Clear errors when toggling mode
  useEffect(() => {
    dispatch(clearError());
    // Reset fields
    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setPhone("");
  }, [isLogin, dispatch]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      if (!email || email.length !== 10) return toast.error("Please enter a valid 10-digit phone number");

      dispatch(loginUser({ email }))
        .unwrap()
        .then((res: any) => {
          // API response (thunk unwraps to response.data directly)
          const requiresOtp = res?.otpRequired || res?.data?.otpRequired;
          const uid = res?.userId || res?.data?.userId || res?.user?.id || res?.data?.user?.id;

          if (requiresOtp) {
            openOtp(uid);
          }
        });
    } else {
      if (!name || !email || !password || !phone) return toast.error("Please fill all required fields");
      if (password !== confirmPassword) return toast.error("Passwords do not match");
      dispatch(registerUser({ name, email, password, phone, role_id: 3 }));
    }
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
          <button className="auth-close" onClick={onClose} disabled={isLoading}>×</button>

          <h2 className="auth-title">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h2>

          {error && <p style={{ color: "red", fontSize: "14px", marginBottom: "10px" }}>{error}</p>}

          {/* FORM */}
          <form className="auth-form" onSubmit={handleSubmit}>
            {!isLogin && (
              <input
                type="text"
                placeholder="Full Name"
                className="auth-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            )}

            <input
              type={isLogin ? "tel" : "email"}
              placeholder={isLogin ? "Phone Number" : "Email"}
              className="auth-input"
              value={email}
              onChange={(e) => {
                const val = e.target.value;
                if (isLogin) {
                  const numericVal = val.replace(/\D/g, "");
                  if (numericVal.length <= 10) {
                    setEmail(numericVal);
                  }
                } else {
                  setEmail(val);
                }
              }}
              pattern={isLogin ? "[0-9]{10}" : "^[^\s@]+@[^\s@]+\.[^\s@]+$"}
              maxLength={isLogin ? 10 : undefined}
              required
            />

            {!isLogin && (
              <input
                type="tel"
                placeholder="Phone Number"
                className="auth-input"
                value={phone}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "");
                  if (val.length <= 10) {
                    setPhone(val);
                  }
                }}
                maxLength={10}
                pattern="[0-9]{10}"
                required
              />
            )}

            {!isLogin && (
              <input
                type="password"
                placeholder="Password"
                className="auth-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            )}

            {!isLogin && (
              <input
                type="password"
                placeholder="Confirm Password"
                className="auth-input"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            )}

            <button type="submit" className="auth-btn" disabled={isLoading}>
              {isLoading ? "Processing..." : isLogin ? "Login" : "Register"}
            </button>
          </form>

          {/* TOGGLE */}
          <p className="auth-toggle">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <span onClick={() => !isLoading && setIsLogin(!isLogin)} style={{ cursor: isLoading ? "not-allowed" : "pointer" }}>
              {isLogin ? " Register" : " Login"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;