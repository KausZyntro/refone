"use client";

import React from "react";
import styles from "./ReturnPolicy.module.css";

const ReturnPolicyPage = () => {
  return (
    <div className={styles.returnPage}>
      {/* Decorative Background Shapes */}
      <div className={`${styles.shape} ${styles.shape1}`}></div>
      <div className={`${styles.shape} ${styles.shape2}`}></div>

      <div className={styles.container}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <h1>Replacement <span className={styles.highlight}>Policy</span></h1>
            <p className={styles.heroSubtitle}>
              We want you to be completely satisfied with your purchase. Learn about our hassle-free replacement process.
            </p>
          </div>
        </section>

        {/* Content Section */}
        <main className={styles.contentWrapper}>
          <div className={styles.content}>
            <h2>1. 7-Day Replacement Window</h2>
            <p>
              We offer a 7-day hassle-free replacement policy for most items purchased on Refone. You have 7 days from the date of delivery to request a replacement if you receive a defective, damaged, or incorrect product.
            </p>
            <ul>
              <li><strong>Condition:</strong> The product must be in its original condition, unused, and in its original packaging with all tags, accessories, and manuals included.</li>
              <li><strong>Exceptions:</strong> Consumable items, software, and certain accessories may not be eligible for replacement unless they arrive defective or damaged.</li>
            </ul>

            <h2>2. How to Request a Replacement</h2>
            <p>Initiating a replacement is simple and straightforward:</p>
            <ul>
              <li>Log in to your Refone account and go to the <strong>My Orders</strong> section.</li>
              <li>Select the order containing the item you want to replace and click on the<strong> Request Replacement</strong> button.</li>
              <li>Provide the reason (defective, damaged, or incorrect item) and submit your request. Our support team will review it within 24-48 hours.</li>
            </ul>

            <h2>3. Replacements</h2>
            <p>
              Once we receive and verify your request:
            </p>
            <ul>
              <li><strong>Refunds:</strong> Approved replacements will be shipped within 5–7 business days.</li>
              <li><strong>Exchanges:</strong> If the item is unavailable, we may offer an alternative product of equal value.</li>
            </ul>

            <h2>4. Replacement Shipping</h2>
            <p>
              If the item is defective, damaged, or incorrect, Refone will cover the replacement shipping costs. For all approved cases, the replacement item will be delivered at no additional cost.
            </p>

            <div className={styles.contactBox}>
              <h3>Need Help with a Replacements?</h3>
              <p>If you have any questions or need assistance with the replacement process, please contact our support team at support@refoneindia.com.</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ReturnPolicyPage;
