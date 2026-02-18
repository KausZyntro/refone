"use client"
import React, { useState } from "react";
import "@/styles/Footer.css";
import Image from "next/image";
import { FaFacebook, FaInstagram, FaXTwitter, FaYoutube } from "react-icons/fa6";

const FooterSection = ({ title, links }) => {
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
        {links.map((link:any, index:any) => (
          <li key={index}>
            <a href={link.href}>{link.label}</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-wrapper">

        {/* Top Section */}
        <div className="footer-top">

          <div className="footer-brand">
            <h2 className="logo">
                <Image src={"/logo.png"} alt='logo' height={50} width={120}/>
            </h2>
            <p className="follow-text">Follow us on</p>
            <div className="social-icons">
              <a href="#"><FaXTwitter/></a>
              <a href="#"><FaFacebook/></a>
              <a href="#"><FaInstagram/></a>
              <a href="#"><FaYoutube/></a>
            </div>
          </div>

          <div className="footer-sections">
            <FooterSection
              title="Services"
              links={[
                { label: "Sell Phone", href: "#" },
                { label: "Repair Phone", href: "#" },
                { label: "Buy Gadgets", href: "#" },
                { label: "Recycle Phone", href: "#" },
              ]}
            />

            <FooterSection
              title="Company"
              links={[
                { label: "About Us", href: "#" },
                { label: "Careers", href: "#" },
                { label: "Press Releases", href: "#" },
              ]}
            />

            <FooterSection
              title="Help & Support"
              links={[
                { label: "FAQ", href: "#" },
                { label: "Contact Us", href: "#" },
                { label: "Refund Policy", href: "#" },
              ]}
            />

            <FooterSection
              title="More Info"
              links={[
                { label: "Terms & Conditions", href: "#" },
                { label: "Privacy Policy", href: "#" },
                { label: "Cookie Policy", href: "#" },
              ]}
            />
          </div>
        </div>

        {/* Bottom Section */}
        <div className="footer-bottom">
          <div className="footer-address">
            <strong>Registered Office:</strong>
            <p>
              Bhadohi,
              Uttar Pradesh,– 221005, India
            </p>
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
