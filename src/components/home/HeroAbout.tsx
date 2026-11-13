import React from "react";
import Image from "next/image";
import "@/styles/HeroAbout.css";

const HeroAbout = () => {

  return (
    <div className="container"  id="download-app-section">
      <div className="heroAbout-container">
        <div className="heroAbout-content">
          <h2 className="heroAbout-title">Download the App</h2>
          <p className="heroAbout-subtitle">
            Sell your old phone | Buy top-quality refurbished phones | Get your phone repaired
          </p>

          <div className="heroAbout-buttons">
            <a
              href="https://play.google.com/store/apps/details?id=com.refone.customer"
              target="_blank"
              rel="noopener noreferrer"
              className="store-btn"
            >
              <Image src="/GooglePlay_Badge.svg" alt="Google Play" width={239} height={71} sizes="140px" />
            </a>

            <a
              href="https://apps.apple.com/in/app/refone/id6768933919"
              target="_blank"
              rel="noopener noreferrer"
              className="store-btns"
            >
              <Image src="/App_Store_Badge.svg" alt="Apple Store" width={120} height={40} sizes="126px" />
            </a>
          </div>
        </div>

        <div className="heroAbout-image">
          <Image src="/iphone.png" alt="Download App Banner" width={485} height={515} sizes="(max-width: 767px) 100vw, 450px" />
        </div>
      </div>
    </div>
  );
};

export default HeroAbout;
