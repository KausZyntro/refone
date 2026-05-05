"use client"
import React, { useState, useEffect } from "react";
import "@/styles/Footer.css";
import Image from "next/image";
import Link from "next/link";
import { FaFacebook, FaInstagram, FaXTwitter, FaYoutube } from "react-icons/fa6";
import axios from "axios";

const FooterSection = ({ title, links }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="footer-section">
      <div
        className="footer-section-header"
        onClick={() => setOpen(!open)}
      >
        <h4 style={{ textTransform: 'capitalize' }}>{title}</h4>
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

const defaultFooterData = {
  "About Refone": [
    { id: 1, title: "About Us", page_key: "about-us-new" },
    { id: 2, title: "Careers", page_key: "careers-new" },
    { id: 3, title: "Contact Us", page_key: "contact-us" }
  ],
  "Help & Support": [
    { id: 4, title: "FAQ", page_key: "privacy-policy" },
    { id: 5, title: "Return Policy", page_key: "terms-conditions" },
    { id: 6, title: "Contact Us", page_key: "contact-us" },
    { id: 7, title: "Shipping Policy", page_key: "shipping-policy" }
  ],
  "More_Info": [
    { id: 8, title: "Privacy Policy", page_key: "privacy-policy" },
    { id: 9, title: "Warrenty Info", page_key: "warrenty-info" },
    { id: 10, title: "Terms & Conditions", page_key: "terms-conditions" },
    { id: 7, title: "Shipping Policy", page_key: "shipping-policy" }
  ]
};

const Footer = () => {
  // const [footerData, setFooterData] = useState<any>(null);
  // const [loading, setLoading] = useState(true);
  const [footerData, setFooterData] = useState<any>(defaultFooterData);

 useEffect(() => {
  const fetchFooterLinks = async () => {
    try {
      const response = await axios.get(
        "https://refones.com/api-auth_v1/api/footer-links"
      );

      if (response.data.status === "success" && response.data.data) {
        setFooterData(response.data.data);
      }
    } catch (err) {
      console.error("API failed, static footer will remain.", err);
    }
  };

  fetchFooterLinks();
}, []);

  // if (loading) {
  //   return (
  //     <footer className="footer">
  //       <div className="footer-wrapper">
  //         <div className="loading-skeleton">Loading footer...</div>
  //       </div>
  //     </footer>
  //   );
  // }

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
              <a href=" https://www.instagram.com/refoneindia?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
              <a href="https://www.youtube.com/@RefoneIndia" target="_blank" rel="noopener noreferrer"><FaYoutube /></a>
            </div>
          </div>

          <div className="footer-sections">
            {footerData && Object.keys(footerData).map((sectionKey) => (
              <FooterSection
                key={sectionKey}
                title={sectionKey}
                links={footerData[sectionKey]}
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
            © {new Date().getFullYear()} Zyntro Software Solution Pvt. Ltd. All rights reserved.
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
