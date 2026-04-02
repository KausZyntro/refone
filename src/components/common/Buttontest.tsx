"use client";

import React from "react";
import styles from "./Buttontest.module.css";

interface ButtonTestProps {
    children: React.ReactNode;
    variant?: "primary" | "outline" | "cart";
    fullWidth?: boolean;
    onClick?: () => void;
    type?: "button" | "submit";
}

const Buttontest: React.FC<ButtonTestProps> = ({
    children,
    variant = "primary",
    fullWidth = false,
    onClick,
    type = "button",
}) => {
    return (
        <button
            type={type}
            className={`${styles.button} ${styles[variant]} ${fullWidth ? styles.fullWidth : ""}`}
            onClick={onClick}
        >
            {children}
        </button>
    );
};

export default Buttontest;
