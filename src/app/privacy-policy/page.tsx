"use client";

import React from "react";
import styles from "./PrivacyPolicy.module.css";

const PrivacyPolicyPage = () => {
  return (
    <div className={styles.privacyPage}>
      {/* Decorative Background Shapes */}
      <div className={`${styles.shape} ${styles.shape1}`}></div>
      <div className={`${styles.shape} ${styles.shape2}`}></div>

      <div className={styles.container}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <h1>
              Privacy <span className={styles.highlight}>Policy</span>
            </h1>
            <p className={styles.heroSubtitle}>
              Your privacy is critically important to us. Learn how we collect,
              use, and protect your data.
            </p>
          </div>
        </section>

        {/* Content Section */}
        <main className={styles.contentWrapper}>
          <div className={styles.content}>
            <p>
              We value your privacy and are committed to protecting your
              personal information. This Privacy Policy explains how we collect,
              use, and safeguard the information you provide when using our
              website or services.
            </p>

            <h2>1. Information We Collect</h2>

            <p>
              We may collect personal information such as your name, email
              address, phone number, company details, and any other information
              you voluntarily provide through forms, inquiries, or account
              registration.
            </p>

            <p>
              We may also collect non-personal information such as browser
              type, device information, IP address, and website usage data.
            </p>

            <ul>
              <li>
                <strong>Basic Account Information:</strong> We may require users
                to provide a phone number or email address while creating an
                account.
              </li>

              <li>
                <strong>Transaction and Billing Information:</strong> If you
                purchase services or products from us, we may collect payment
                and billing information necessary to process transactions.
              </li>

              <li>
                <strong>Usage Information:</strong> We may collect analytics and
                usage data to improve our services and user experience.
              </li>
            </ul>

            <h2>2. How We Use Information</h2>

            <p>
              We use your information for the following purposes:
            </p>

            <ul>
              <li>
                To provide, maintain, and improve our services.
              </li>

              <li>
                To process transactions, requests, and customer support
                inquiries.
              </li>

              <li>
                To personalize user experience and communicate important
                updates.
              </li>

              <li>
                To monitor trends, analyze usage, and improve platform
                performance.
              </li>
            </ul>

            <h2>3. Photos and Camera Access</h2>

            <p>
              Refone may request access to your device camera or photo gallery
              to:
            </p>

            <ul>
              <li>
                Capture photos of devices for inspection and verification.
              </li>

              <li>
                Upload device images during the selling or exchange process.
              </li>
            </ul>

            <p>
              We only access your camera or photos when you choose to use these
              features and provide permission.
            </p>

            <h2>4. Sharing of Information</h2>

            <p>
              We do not sell, trade, or rent your personal information to third
              parties.
            </p>

            <p>
              However, we may share information with trusted service providers
              who assist in operating our business, provided they keep your
              information confidential. We may also disclose information if
              required by law or to protect our legal rights.
            </p>

            <h2>5. Security</h2>

            <p>
              We use reasonable security measures to protect your information
              from unauthorized access, misuse, or disclosure. While we strive
              to protect your data, no online service can guarantee complete
              security.
            </p>

            <h2>6. Policy Changes</h2>

            <p>
              Refone may update this Privacy Policy from time to time. We
              encourage users to review this page periodically for any changes.
              Continued use of our website or services after changes are posted
              constitutes acceptance of the updated policy.
            </p>

            <div className={styles.contactBox}>
              <h3>Have questions?</h3>

              <p>
                If you have any questions about this Privacy Policy, please
                contact us through our official website.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;