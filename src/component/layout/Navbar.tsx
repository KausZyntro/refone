"use client"
import React, { useState } from 'react'
import "@/styles/Navbar.css";

import {
  FiSearch,
  FiMapPin,
  FiChevronDown,
  FiMenu,
  FiX,
} from "react-icons/fi";
import Image from 'next/image';
import AuthModal from './AuthModal';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);

  return (
    <>
    <div className="navbar">
      <div className="nav-top">

        <div className="nav-left">
          <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </div>

          <div className="logo">
            <Image src={"/logo.png"} alt='logo' height={50} width={120}/>
            
          </div>
        </div>

        <div className="search-box">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search for mobiles, accessories & More"
          />
        </div>

        <div className="nav-actions">
          <div className="location">
            <FiMapPin />
            <span>Rameswaram</span>
            <FiChevronDown size={14} />
          </div>

          <button className="login-btn" onClick={() => setAuthOpen(true)}>Login</button>
        </div>
      </div>

      <div className="nav-bottom">
        <div className="menu-item">All <FiChevronDown size={14} /></div>
        <div className="menu-item">Sell Phone <FiChevronDown size={14} /></div>
        <div className="menu-item">Sell Gadgets <FiChevronDown size={14} /></div>
        <div className="menu-item">Buy Refurbished Devices <FiChevronDown size={14} /></div>
        <div className="menu-item">Buy Laptop <FiChevronDown size={14} /></div>
        <div className="menu-item">More <FiChevronDown size={14} /></div>
      </div>

      {menuOpen && (
        <div className="mobile-menu">
          <div className="mobile-item">All</div>
          <div className="mobile-item">Sell Phone</div>
          <div className="mobile-item">Sell Gadgets</div>
          <div className="mobile-item">Buy Refurbished Devices</div>
          <div className="mobile-item">Buy Laptop</div>
          <div className="mobile-item">More</div>
          <div className="mobile-item">
              <div className="locations">
              <FiMapPin />
              <span>Rameswaram</span>
              <FiChevronDown size={14} />
             </div>
          </div>
          <div className="mobile-item">
            <button
                className="login-btns"
                onClick={() => {
                  setAuthOpen(true);
                  setMenuOpen(false);
                }}
              >
                Login
              </button>
          </div>
          
          
        </div>

      )}
    </div>
    <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
      />
      </>
  );
};

export default Navbar;



