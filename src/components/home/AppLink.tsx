"use client";
import React from "react";
import Image from "next/image";
import "@/styles/AppLink.css";

const AppLink = () => {
  return (
    <section className="applink-section">
      <div className="applink-container">
        {/* Desktop Image */}
        <div className="applink-image desktop-image">
          <Image
            src="/applinkDesktop.jpeg" /* Replace with your 1360x480 desktop image path */
            alt="Download our App"
            width={1360}
            height={480}
            priority
          />
        </div>
        
        {/* Mobile Image */}
        <div className="applink-image mobile-image">
          <Image
            src="/appLinkMobile.jpeg" /* Replace with your 370x300 mobile image path */
            alt="Download our App"
            width={370}
            height={300}
            priority
          />
        </div>

        {/* Links positioned on top of the image */}
        <div className="applink-buttons">
          <a href="https://apps.apple.com/in/app/refone/id6768933919" className="store-btn" target="_blank" rel="noopener noreferrer">
            <Image src="/App_Store_Badge.svg" alt="Download on the App Store" width={200} height={100} />
          </a>
          <a href="https://play.google.com/store/apps/details?id=com.refone.customer" className="store-btn" target="_blank" rel="noopener noreferrer">
            <Image src="/GooglePlay_Badge.svg" alt="Get it on Google Play" width={280} height={100} />
          </a>
        </div>
      </div>
    </section>
  );
};

export default AppLink;
