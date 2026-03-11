"use client";
import React, { useState } from "react";
import "@/styles/AuthModal.css";
import Lottie from "lottie-react";
import animationData from "../../../public/lottie/shopping-cart.json";
import { authAPI } from "@/services/api";

const VerifyOTPResetPasswordModal = ({
    isOpen,
    onClose,
    userId,
    openLogin,
}: {
    isOpen: boolean;
    onClose: () => void;
    userId: number | null;
    openLogin: () => void;
}) => {
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!otp || !newPassword) return alert("Please fill all fields");
        if (!userId) return alert("User ID is missing. Please restart the process.");

        setIsLoading(true);
        setError(null);
        try {
            await authAPI.resetPassword(userId, otp, newPassword);
            alert("Password reset successful! Please login with your new password.");
            onClose();
            openLogin();
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || "Failed to reset password. Please try again.");
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

                    <h2 className="auth-title">Verify OTP & Reset Password</h2>

                    {error && (
                        <p style={{ color: "red", fontSize: "14px", marginBottom: "10px" }}>
                            {error}
                        </p>
                    )}

                    {/* FORM */}
                    <form className="auth-form" onSubmit={handleSubmit}>
                        <input
                            type="text"
                            placeholder="Enter OTP"
                            className="auth-input"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            required
                        />

                        <input
                            type="password"
                            placeholder="New Password"
                            className="auth-input"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />

                        <button type="submit" className="auth-btn" disabled={isLoading}>
                            {isLoading ? "Processing..." : "Verify OTP & Reset Password"}
                        </button>
                    </form>

                    {/* TOGGLE */}
                    <p className="auth-toggle">
                        Remembered your password?
                        <span
                            onClick={() => {
                                if (!isLoading) {
                                    onClose();
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

export default VerifyOTPResetPasswordModal;
