"use client"
import React, { useState } from "react";
import "@/styles/Footer.css";
import Image from "next/image";
import Link from "next/link";
import { FaFacebook, FaInstagram, FaXTwitter, FaYoutube } from "react-icons/fa6";

const FooterSection = ({ title, links }: { title: string, links: any[] }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="footer-section">
      <div
        className="footer-section-header"
        onClick={() => setOpen(!open)}
      >
        <h4>{title}</h4>
        <span className={`arrow ${open ? "rotate" : ""}`}>⌄</span>
      </div>

      <ul className={`footer-links ${open ? "open" : ""}`}>
        {links.map((link: any) => (
          <li key={link.id}>
            <Link href={`/${link.page_key}`}>{link.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

const staticFooterData = {
  "Company": [
    // { id: 1, title: "About Us", page_key: "about-us-new" },
    { id: 1, title: "About Us", page_key: "about-us" },
    { id: 2, title: "Our Story", page_key: "our-story" },
    { id: 3, title: "Careers", page_key: "careers-new" },
    { id: 11, title: "Blog", page_key: "blog" }
  ],
  "Help_support": [
    { id: 4, title: "FAQ", page_key: "faq" },
    // { id: 5, title: "Shipping Info", page_key: "shipping-policy" },
    { id: 6, title: "Replacement Policy", page_key: "return-policy" },
    { id: 7, title: "Contact Us", page_key: "contact-us" }
  ],
  "More_info": [
    { id: 8, title: "Privacy Policy", page_key: "privacy-policy" },
    { id: 9, title: "Warranty Info", page_key: "warranty-info" },
    { id: 10, title: "Terms & Conditions", page_key: "terms-conditions" }
  ]
};

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-wrapper">

        {/* Top Section */}
        <div className="footer-top">

          <div className="footer-brand">
            <h2 className="logo">
              <Link href="/">
                <Image src={"/logo.png"} alt='logo' height={50} width={120} />
              </Link>
            </h2>
            <p className="follow-text">Follow us on</p>
            <div className="social-icons">
              <a href="https://x.com/RefoneIndia" target="_blank" rel="noopener noreferrer"><FaXTwitter /></a>
              <a href="https://www.facebook.com/profile.php?id=61575393901517" target="_blank" rel="noopener noreferrer"><FaFacebook /></a>
              <a href="https://www.instagram.com/refoneindia?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
              <a href="https://www.youtube.com/@RefoneIndia" target="_blank" rel="noopener noreferrer"><FaYoutube /></a>
            </div>
          </div>

          <div className="footer-sections">
            {Object.keys(staticFooterData).map((sectionKey) => (
              <FooterSection
                key={sectionKey}
                title={sectionKey}
                links={staticFooterData[sectionKey as keyof typeof staticFooterData]}
              />
            ))}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="footer-bottom">
          <div className="footer-address">
            <strong>Registered Office:</strong>
            <p>
              S-2/1A-81-R-I/101, Tagore Town Colony, Orderly Bazar Varanasi-221002
            </p>
            <p>5/1 Ranglal Street, Watgunge,, Kolkata-700023, West Bengal</p>
          </div>

          <div className="footer-copy">
            © 2026 Zyntro Software Solution Pvt. Ltd. All rights reserved.
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
