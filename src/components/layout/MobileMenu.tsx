"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { FiChevronRight, FiMapPin, FiX } from "react-icons/fi";
import {
  FaHome,
  FaMobileAlt,
  FaExchangeAlt,
  FaRupeeSign,
  FaBlog,
  FaInfoCircle,
  FaQuestionCircle,
  FaPhoneAlt,
  FaUser,
  FaBoxOpen,
} from "react-icons/fa";

export type MobileMenuProps = {
  isOpen: boolean;
  onClose: () => void;
  isLoggedIn: boolean;
  accountLabel?: string;
  city?: string;
  onLogin: () => void;
  onLogout: () => void;
  onSelectLocation: () => void;
};

const navLinks = [
  { label: "Home", href: "/", icon: FaHome },
  { label: "All Phones", href: "/allProduct", icon: FaMobileAlt },
  { label: "Exchange Phone", href: "/exchange-phone", icon: FaExchangeAlt },
  { label: "Sell / Buyback", href: "/buyback-request", icon: FaRupeeSign },
  { label: "Blog", href: "/blog", icon: FaBlog },
  { label: "About Us", href: "/about-us", icon: FaInfoCircle },
  { label: "FAQ", href: "/faq", icon: FaQuestionCircle },
  { label: "Contact Us", href: "/contact-us", icon: FaPhoneAlt },
];

const MobileMenu = ({
  isOpen,
  onClose,
  isLoggedIn,
  accountLabel,
  city,
  onLogin,
  onLogout,
  onSelectLocation,
}: MobileMenuProps) => {
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  // Lock page scrolling and allow Escape to close the drawer while it is open.
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCloseRef.current();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <>
      <div
        className={`overlay ${isOpen ? "open" : ""}`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        className={`mobile-drawer ${isOpen ? "open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        aria-hidden={!isOpen}
      >
        <div className="mobile-drawer-header">
          <span className="mobile-drawer-title">Menu</span>
          <button
            type="button"
            className="mobile-drawer-close"
            onClick={onClose}
            aria-label="Close menu"
          >
            <FiX size={22} />
          </button>
        </div>

        {isLoggedIn && (
          <div className="mobile-drawer-account">
            <FaUser size={18} />
            <div className="mobile-drawer-account-info">
              <span className="mobile-drawer-account-label">Signed in as</span>
              <span className="mobile-drawer-account-name">
                {accountLabel || "My Profile"}
              </span>
            </div>
          </div>
        )}

        <nav className="mobile-drawer-nav">
          {navLinks.map(({ label, href, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="mobile-drawer-link"
              onClick={onClose}
            >
              <Icon size={16} />
              <span>{label}</span>
            </Link>
          ))}
        </nav>

        <div className="mobile-drawer-divider" />

        <nav className="mobile-drawer-nav">
          {isLoggedIn && (
            <>
              <Link
                href="/my-account"
                className="mobile-drawer-link"
                onClick={onClose}
              >
                <FaUser size={16} />
                <span>My Account</span>
              </Link>
              <Link
                href="/my-orders"
                className="mobile-drawer-link"
                onClick={onClose}
              >
                <FaBoxOpen size={16} />
                <span>My Orders</span>
              </Link>
            </>
          )}

          <button
            type="button"
            className="mobile-drawer-link mobile-drawer-location"
            onClick={onSelectLocation}
          >
            <FiMapPin size={16} />
            <span>{city || "Select Location"}</span>
            <FiChevronRight size={16} className="mobile-drawer-location-arrow" />
          </button>
        </nav>

        <div className="mobile-drawer-footer">
          {isLoggedIn ? (
            <button type="button" className="logout-btns" onClick={onLogout}>
              Logout
            </button>
          ) : (
            <button type="button" className="login-btns" onClick={onLogin}>
              Login / Sign Up
            </button>
          )}
        </div>
      </aside>
    </>
  );
};

export default MobileMenu;
