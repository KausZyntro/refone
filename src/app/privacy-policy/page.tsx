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
              use, and protect your information while using Refone services.
            </p>
          </div>
        </section>

        {/* Content Section */}
        <main className={styles.contentWrapper}>
          <div className={styles.content}>
            {/* <p>
              Effective Date: May 14, 2026
            </p> */}

            <p>
              Welcome to Refone. Your privacy is important to us, and we are
              committed to protecting your personal information. This Privacy
              Policy explains how Refone collects, uses, stores, and safeguards
              information when you use our mobile application, website, and
              related services.
            </p>

            <p>
              By using Refone, you agree to the practices described in this
              Privacy Policy.
            </p>

            <h2>1. Information We Collect</h2>

            <p>
              We may collect personal information that you voluntarily provide
              while using our services.
            </p>

            <ul>
              <li>
                <strong>Personal Information:</strong> Name, email address,
                phone number, address, company information, and account
                credentials.
              </li>

              <li>
                <strong>Basic Account Information:</strong> Users may be
                required to provide a verified email address or mobile number
                during account creation.
              </li>

              <li>
                <strong>Transaction and Billing Information:</strong> If you
                purchase products or services from Refone, we may collect
                billing details, payment status, and transaction history
                necessary to process orders securely.
              </li>

              <li>
                <strong>Usage Information:</strong> We may collect analytics,
                interaction data, app performance information, and browsing
                activity to improve our services and user experience.
              </li>

              <li>
                <strong>Device Information:</strong> Device type, operating
                system, browser type, IP address, app version, and diagnostic
                reports may be collected automatically.
              </li>
            </ul>

            <h2>2. How We Use Information</h2>

            <p>
              We use your information for legitimate business and operational
              purposes, including:
            </p>

            <ul>
              <li>
                To provide, maintain, and improve our services.
              </li>

              <li>
                To process transactions, customer requests, and support
                inquiries.
              </li>

              <li>
                To personalize user experience and provide relevant updates.
              </li>

              <li>
                To monitor trends, analyze platform usage, and improve app
                performance.
              </li>

              <li>
                To detect fraud, unauthorized activity, and maintain security.
              </li>

              <li>
                To comply with legal obligations and enforce our policies.
              </li>
            </ul>

            <h2>3. Photos and Camera Access</h2>

            <p>
              Refone may request access to your device camera, media, or photo
              gallery for specific app features.
            </p>

            <ul>
              <li>
                Capture photos of devices for inspection and verification.
              </li>

              <li>
                Upload device images during the selling or exchange process.
              </li>

              <li>
                Upload documents or profile images for account-related features.
              </li>
            </ul>

            <p>
              We only access your camera or media files after you grant
              permission and actively choose to use these features.
            </p>

            <p>
              You may revoke these permissions at any time through your device
              settings.
            </p>

            <h2>4. Sharing of Information</h2>

            <p>
              Refone does not sell, trade, or rent personal information to
              third parties.
            </p>

            <p>
              We may share information with trusted service providers who assist
              us in operating our business, including payment processors,
              analytics providers, cloud hosting services, and customer support
              tools. These providers are required to maintain confidentiality
              and use information only for authorized purposes.
            </p>

            <p>
              We may also disclose information if required by law, regulation,
              legal process, or when necessary to protect our legal rights,
              users, or platform security.
            </p>

            <h2>5. Data Security</h2>

            <p>
              We implement reasonable technical and organizational security
              measures to protect your information from unauthorized access,
              misuse, disclosure, or alteration.
            </p>

            <p>
              While we strive to use commercially acceptable methods to protect
              your personal information, no online platform or electronic
              storage system can guarantee complete security.
            </p>

            <h2>6. Data Retention</h2>

            <p>
              We retain personal information only for as long as necessary to
              provide services, comply with legal obligations, resolve disputes,
              and enforce agreements.
            </p>

            <p>
              When information is no longer required, we securely delete or
              anonymize it.
            </p>

            <h2>7. Your Privacy Rights</h2>

            <p>
              Depending on applicable laws and regulations, users may have the
              right to:
            </p>

            <ul>
              <li>Access their personal information.</li>

              <li>Request correction of inaccurate information.</li>

              <li>Request deletion of personal data.</li>

              <li>Withdraw permissions previously granted.</li>

              <li>Opt out of promotional communications.</li>
            </ul>

            <h2>8. Children’s Privacy</h2>

            <p>
              Refone does not knowingly collect personal information from
              children under the age of 13. If such information is identified,
              we will take reasonable steps to remove it promptly.
            </p>

            <h2>9. Third-Party Services</h2>

            <p>
              Our services may contain links or integrations with third-party
              platforms or services. Refone is not responsible for the privacy
              practices or content of external websites or services.
            </p>

            <p>
              Users are encouraged to review the privacy policies of any
              third-party services they interact with.
            </p>

            <h2>10. Policy Changes</h2>

            <p>
              Refone may update this Privacy Policy from time to time to reflect
              changes in services, legal requirements, or operational practices.
            </p>

            <p>
              Updated versions will be posted within the app or on our official
              website along with the revised effective date.
            </p>

            <p>
              Continued use of our services after updates become effective
              constitutes acceptance of the updated Privacy Policy.
            </p>

            <div className={styles.contactBox}>
              <h3>Have questions?</h3>

              <p>
                If you have any questions, concerns, or requests regarding this
                Privacy Policy, please contact us through our official support
                channels or website.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;