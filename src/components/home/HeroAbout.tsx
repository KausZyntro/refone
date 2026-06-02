import React from "react";
import "@/styles/HeroAbout.css";

const HeroAbout = () => {
  return (
    <div className="container">
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
              <img
                src="/GooglePlay_Badge.svg"
                alt="Google Play"
              />
            </a>

            <a
              href="https://apps.apple.com/in/app/refone/id6768933919"
              target="_blank"
              rel="noopener noreferrer"
              className="store-btns"
            >
              <img
                src="/App_Store_Badge.svg"
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
