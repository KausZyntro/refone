"use client";
import React, { useState } from "react";
import "@/styles/AuthModal.css";
import Lottie from "lottie-react";
import animationData from "../../../public/lottie/shopping-cart.json";
import { authAPI } from "@/services/api";

const ForgotPasswordModal = ({
    isOpen,
    onClose,
    openOtp,
    openLogin,
}: {
    isOpen: boolean;
    onClose: () => void;
    openOtp: (userId: number) => void;
    openLogin: () => void;
}) => {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return alert("Please enter your email");

        setIsLoading(true);
        setError(null);
        try {
            const response = await authAPI.forgotPassword(email);
            // Expected response structure has data.userId
            const uid = response?.data?.userId;
            alert(response?.message || "OTP has been sent to your registered email address.");
            if (uid) {
                onClose();
                openOtp(uid);
            }
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || "Something went wrong.");
        } finally {
            setIsLoading(false);
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
                    <button className="auth-close" onClick={onClose} disabled={isLoading}>
                        ×
                    </button>

                    <h2 className="auth-title">Forgot Password</h2>

                    {error && (
                        <p style={{ color: "red", fontSize: "14px", marginBottom: "10px" }}>
                            {error}
                        </p>
                    )}

                    {/* FORM */}
                    <form className="auth-form" onSubmit={handleSubmit}>
                        <input
                            type="email"
                            placeholder="Registered Email"
                            className="auth-input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
                            required
                        />

                        <button type="submit" className="auth-btn" disabled={isLoading}>
                            {isLoading ? "Processing..." : "Send OTP"}
                        </button>
                    </form>

                    {/* TOGGLE */}
                    <p className="auth-toggle">
                        Remembered your password?
                        <span
                            onClick={() => {
                                if (!isLoading) {
                                    openLogin();
                                }
                            }}
                            style={{ cursor: isLoading ? "not-allowed" : "pointer" }}
                        >
                            {" "}Login
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordModal;
