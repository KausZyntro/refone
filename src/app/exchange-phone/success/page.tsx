"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MdVerified } from 'react-icons/md';
import styles from './success.module.css';

export default function ExchangeSuccessPage() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // Redirect to home after 5 seconds
    const timer = setTimeout(() => {
      router.push('/');
    }, 5000);

    // Countdown interval
    const interval = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [router]);

  return (
    <div className={styles.successContainer}>
      <div className={styles.successIcon}>
        <MdVerified />
      </div>
      <h2 className={styles.successTitle}>Pickup Scheduled Successfully!</h2>
      <p className={styles.successMessage}>
        Our partner will reach out to you shortly to confirm the pickup details.
      </p>
      
      <p className={styles.redirectMessage}>
        Redirecting to home in {countdown} seconds...
      </p>
    </div>
  );
}
