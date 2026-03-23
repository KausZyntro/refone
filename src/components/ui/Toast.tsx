"use client";
import React, { useEffect } from "react";
import { FaCheckCircle, FaTimesCircle, FaTimes } from "react-icons/fa";

interface ToastProps {
    message: string;
    type: "success" | "error";
    onClose: () => void;
    /** Auto-dismiss after this many ms. Default = 3000. */
    duration?: number;
}

const Toast: React.FC<ToastProps> = ({
    message,
    type,
    onClose,
    duration = 3000,
}) => {
    useEffect(() => {
        const timer = setTimeout(onClose, duration);
        return () => clearTimeout(timer);
    }, [onClose, duration]);

    return (
        <div className={`toast toast-${type}`} role="alert" aria-live="polite">
            <span className="toast-icon">
                {type === "success" ? <FaCheckCircle /> : <FaTimesCircle />}
            </span>
            <p className="toast-message">{message}</p>
            <button
                className="toast-close"
                onClick={onClose}
                aria-label="Dismiss notification"
            >
                <FaTimes />
            </button>
        </div>
    );
};

export default Toast;
