import React from "react";
import "@/styles/HeroAbout.css";

const HeroAbout = () => {
  return (
    <div className="heroAbout-wrapper">
      <div className="heroAbout-container">
        <div className="heroAbout-content">
          <h2 className="heroAbout-title">Download the App</h2>
          <p className="heroAbout-subtitle">
            Sell your old phone | Buy top-quality refurbished phones | Get your phone repaired
          </p>

          <div className="heroAbout-buttons">
            <a
              href="https://play.google.com/store/apps/details?id=com.reglobe.cashify"
              target="_blank"
              rel="noopener noreferrer"
              className="store-btn"
            >
              <img
                src="https://s3ng.cashify.in/cashify/web/images/landing/svgs/google-play.svg"
                alt="Google Play"
              />
            </a>

            <a
              href="https://itunes.apple.com/in/app/cashify/id1133551195?mt=8"
              target="_blank"
              rel="noopener noreferrer"
              className="store-btn"
            >
              <img
                src="https://s3ng.cashify.in/cashify/web/images/landing/svgs/apple-store.svg"
                alt="Apple Store"
              />
            </a>
          </div>
        </div>

        <div className="heroAbout-image">
          <img
            src="../iphone.png"
            alt="Download App Banner"
          />
        </div>
      </div>
    </div>
  );
};

export default HeroAbout;
