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

const Footer = () => {
  const [footerData, setFooterData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFooterLinks = async () => {
      try {
        const response = await axios.get("https://refones.com/api-auth_v1/api/footer-links");
        if (response.data.status === "success") {
          setFooterData(response.data.data);
        } else {
          setError("Failed to fetch footer links");
        }
      } catch (err) {
        setError("An error occurred while fetching footer links");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFooterLinks();
  }, []);

  if (loading) {
    return (
      <footer className="footer">
        <div className="footer-wrapper">
          <div className="loading-skeleton">Loading footer...</div>
        </div>
      </footer>
    );
  }

  if (error) {
    return (
      <footer className="footer">
        <div className="footer-wrapper">
          <div className="error-message">{error}</div>
        </div>
      </footer>
    );
  }

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
              <a href="#" target="_blank" rel="noopener noreferrer"><FaXTwitter /></a>
              <a href="#" target="_blank" rel="noopener noreferrer"><FaFacebook /></a>
              <a href="#" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
              <a href="#" target="_blank" rel="noopener noreferrer"><FaYoutube /></a>
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
