"use client";

import React from "react";
import styles from "./WarrantyInfo.module.css";

const WarrantyInfoPage = () => {
  return (
    <div className={styles.warrantyPage}>
      {/* Decorative Shapes */}
      <div className={`${styles.shape} ${styles.shape1}`}></div>
      <div className={`${styles.shape} ${styles.shape2}`}></div>

      <div className={styles.container}>
        {/* Hero */}
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <h1>
              Warranty <span className={styles.highlight}>Info</span>
            </h1>

            <p className={styles.heroSubtitle}>
              Understand how our warranty works for refurbished iPhones and what is covered.
            </p>
          </div>
        </section>

        {/* Content */}
        <main className={styles.contentWrapper}>
          <div className={styles.content}>

            <p>
              We provide warranty on selected refurbished iPhones to ensure
              peace of mind and a trustworthy buying experience.
            </p>

            <h2>1. Warranty Coverage</h2>
            <ul>
              <li>Hardware functionality of the device</li>
              <li>Battery performance under normal usage</li>
              <li>Display and internal components (non-physical damage cases)</li>
            </ul>

            <h2>2. Warranty Period</h2>
            <p>
              Warranty duration varies by product and is clearly mentioned on the product page.
              Standard warranty ranges from <strong>7 days to 12 months</strong> depending on device condition.
            </p>

            <h2>3. What is NOT Covered</h2>
            <ul>
              <li>Physical damage (cracks, drops, broken glass)</li>
              <li>Water or liquid damage</li>
              <li>Unauthorized repairs or tampering</li>
              <li>Software issues caused by user modifications</li>
            </ul>

            <h2>4. Claim Process</h2>
            <p>
              To claim warranty, users must contact our support team with order details
              and a clear description of the issue. Our team will inspect the device
              before approving any replacement or repair.
            </p>

            <h2>5. Replacement Policy</h2>
            <p>
              If the device is found to be defective under warranty terms,
              we may offer repair or replacement based on availability and condition.
            </p>

            <h2>6. Important Notes</h2>
            <ul>
              <li>Warranty is non-transferable</li>
              <li>Proof of purchase is mandatory</li>
              <li>Device must be returned for inspection if required</li>
              <li>Decision of inspection team will be final</li>
            </ul>

            <h2>7. Our Commitment</h2>
            <p>
              We carefully test every refurbished iPhone before delivery. Our warranty
              is designed to provide extra confidence and ensure a smooth customer experience.
            </p>

            <div className={styles.contactBox}>
              <h3>Need Warranty Support?</h3>
              <p>
                If you face any issue with your device, contact our support team
                and we will assist you as quickly as possible.
              </p>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default WarrantyInfoPage;