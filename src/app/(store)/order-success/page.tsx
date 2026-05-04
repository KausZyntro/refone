"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { FaCheckCircle } from "react-icons/fa";
import styles from "./order-success.module.css";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { resetOrderState } from "@/redux/features/orderSlice";

export default function OrderSuccessPage() {
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        // Reset order state when landing on success page
        dispatch(resetOrderState());
    }, [dispatch]);

    return (
        <main className={styles.successContainer}>
            <div className={styles.successCard}>
                <div className={styles.iconWrapper}>
                    <FaCheckCircle />
                </div>
                <h1 className={styles.title}>Order Placed Successfully!</h1>
                <p className={styles.message}>
                    Thank you for your purchase. Your order has been received and is being processed. 
                    You will receive an email confirmation shortly.
                </p>
                <div className={styles.buttonGroup}>
                    <Link href="/my-orders" className={styles.btnPrimary}>
                        View My Orders
                    </Link>
                    <Link href="/" className={styles.btnSecondary}>
                        Continue Shopping
                    </Link>
                </div>
            </div>
        </main>
    );
}
