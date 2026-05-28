"use client";

import React from "react";
import styles from "./TermsAndConditions.module.css";

const TermsAndConditionsPage = () => {
  return (
    <div className={styles.termsPage}>
      {/* Decorative Shapes */}
      <div className={`${styles.shape} ${styles.shape1}`}></div>
      <div className={`${styles.shape} ${styles.shape2}`}></div>

      <div className={styles.container}>
        {/* Hero */}
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <h1>
              Terms & <span className={styles.highlight}>Conditions</span>
            </h1>

            <p className={styles.heroSubtitle}>
              Please read these terms carefully before using our services or purchasing refurbished iPhones.
            </p>
          </div>
        </section>

        {/* Content */}
        <main className={styles.contentWrapper}>
          <div className={styles.content}>

            <p>
              By accessing or using our website and services, you agree to be
              bound by these Terms & Conditions. If you do not agree, please do
              not use our platform.
            </p>

            <h2>1. General Information</h2>
            <p>
              We provide refurbished iPhones that are tested, verified, and sold
              at competitive prices. All products are pre-owned devices that may
              show minor signs of usage.
            </p>

            <h2>2. Product Condition</h2>
            <ul>
              <li>All devices are refurbished and fully functional</li>
              <li>Minor cosmetic wear may be present</li>
              <li>Battery health and performance are checked before sale</li>
              <li>Condition grading is provided honestly</li>
            </ul>

            <h2>3. Pricing & Availability</h2>
            <p>
              Prices are subject to change without prior notice. Availability of
              products depends on stock and demand.
            </p>

            <h2>4. Orders & Payments</h2>
            <ul>
              <li>Orders are confirmed only after successful payment</li>
              <li>We reserve the right to cancel suspicious or fraudulent orders</li>
              <li>All payments must be completed through secure methods</li>
            </ul>

            <h2>5. Shipping & Delivery</h2>
            <p>
              We aim to deliver products within the estimated timeframe.
              Delays may occur due to logistics or external factors.
            </p>

            <h2>6. Return & Refund Policy</h2>
            <ul>
              <li>Returns are accepted only under valid issues (dead-on-arrival, wrong item)</li>
              <li>Device must be returned in original condition</li>
              <li>Refunds are processed after inspection</li>
              <li>Refund timelines may vary depending on payment method</li>
            </ul>

            <h2>7. Warranty</h2>
            <p>
              Some refurbished devices may include limited warranty. Warranty
              does not cover physical damage, water damage, or unauthorized repair.
            </p>

            <h2>8. User Responsibilities</h2>
            <ul>
              <li>Provide accurate information while placing orders</li>
              <li>Do not misuse or attempt fraudulent activity</li>
              <li>Use products responsibly after purchase</li>
            </ul>

            <h2>9. Limitation of Liability</h2>
            <p>
              We are not responsible for indirect damages, data loss, or misuse
              of devices after delivery.
            </p>

            <h2>10. Changes to Terms</h2>
            <p>
              We reserve the right to update these Terms & Conditions at any time.
              Continued use of our services means acceptance of updated terms.
            </p>

            <div className={styles.contactBox}>
              <h3>Need Help?</h3>
              <p>
                If you have any questions regarding these Terms & Conditions,
                feel free to contact our support team.
              </p>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default TermsAndConditionsPage;