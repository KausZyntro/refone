"use client";

import React from "react";
import styles from "./OurStory.module.css";

const OurStoryPage = () => {
  return (
    <div className={styles.ourStoryPage}>
      {/* Decorative Background Shapes */}
      <div className={`${styles.shape} ${styles.shape1}`}></div>
      <div className={`${styles.shape} ${styles.shape2}`}></div>

      <div className={styles.container}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <h1>
              Our <span className={styles.highlight}>Story</span>
            </h1>

            <p className={styles.heroSubtitle}>
              Making premium refurbished iPhones affordable, reliable, and accessible for everyone.
            </p>
          </div>
        </section>

        {/* Content */}
        <main className={styles.contentWrapper}>
          <div className={styles.content}>

            <p>
              We started with a simple mission — to make premium Apple iPhones
              accessible to everyone without the heavy price tag.
            </p>

            <p>
              In today’s world, owning an iPhone is a dream for many, but high
              prices often make it difficult. That’s where we stepped in with a
              better solution — <strong>high-quality refurbished iPhones at fair prices</strong>.
            </p>

            <h2>Why We Started</h2>
            <p>
              We noticed that many people wanted iPhones but either overpaid for
              new devices or risked buying untrusted second-hand phones.
              There was no perfect balance between price, quality, and trust.
            </p>

            <h2>What We Do</h2>
            <ul>
              <li>Carefully tested and verified refurbished iPhones</li>
              <li>100% functional devices with quality checks</li>
              <li>Affordable pricing compared to brand-new models</li>
              <li>Transparent condition grading (no hidden surprises)</li>
            </ul>

            <h2>Our Promise</h2>
            <p>
              Every iPhone we sell goes through strict testing to ensure it works
              like it should. We focus on quality, battery health, performance,
              and customer satisfaction.
            </p>

            <h2>Why Choose Us</h2>
            <ul>
              <li>Trusted refurbished devices</li>
              <li>Better pricing than market alternatives</li>
              <li>Quality assurance before delivery</li>
              <li>Support even after purchase</li>
            </ul>

            <h2>Our Vision</h2>
            <p>
              We aim to become a trusted platform for refurbished smartphones in
              India, where customers can confidently buy premium devices without
              worrying about quality or fraud.
            </p>

            <div className={styles.contactBox}>
              <h3>Join Our Journey</h3>
              <p>
                Experience premium iPhones at the right price. We’re here to make
                technology more affordable and accessible for everyone.
              </p>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default OurStoryPage;