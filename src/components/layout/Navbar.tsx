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
import OtpModal from './OtpModal';
import ForgotPasswordModal from './ForgotPasswordModal';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { logout, verifyOtpUser } from '@/redux/features/authSlice';
import { RootState } from "@/redux/store";
import { FaCartShopping, FaUser } from 'react-icons/fa6';
import { LiaShoppingCartSolid } from 'react-icons/lia';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [otpOpen, setOtpOpen] = useState(false);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);
  const dispatch = useDispatch<AppDispatch>();

  const { user, token } = useSelector((state: RootState) => state.auth);
  console.log(user?.name);
  // console.log(token)
  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <>
      <div className="navbar">
        <div className="nav-top">

          <div className="nav-left">
            <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </div>

            <div className="logo">
              <Image src={"/logo.png"} alt='logo' height={50} width={120} />

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
            {token ? (
              <div className='cart'>
                <LiaShoppingCartSolid size={30} />
              </div>
            ) : null}

            {
              token ? (
                <div className='user-profile-wrapper'>
                  <div className="user-profile" onClick={() => setProfileOpen(!profileOpen)}>
                    <FaUser />
                    <span>{user?.name || 'User'}</span>
                    <FiChevronDown size={14} />
                  </div>
                  {
                    profileOpen && (
                      <div className="profile-dropdown">
                        <div className="dropdown-item">Orders</div>
                        <div className="dropdown-item" onClick={handleLogout}>
                          Logout
                        </div>
                      </div>
                    )
                  }
                </div>
                // <button className="logout-btn" onClick={handleLogout}>Logout</button>
              ) : (
                <button className="login-btn" onClick={() => setAuthOpen(true)}>
                  Login
                </button>
              )
            }

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
            <div className="mobile-item">Orders</div>
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
            <div className="mobile-item-btn">
              {/* <button
                className="login-btns"
                onClick={() => {
                  setAuthOpen(true);
                  setMenuOpen(false);
                }}
              >
                Login
              </button> */}
              {
                token ? (
                  <button className="logout-btns" onClick={handleLogout}>Logout</button>
                ) : (
                  <button className="login-btns" onClick={() => {
                    setAuthOpen(true);
                    setMenuOpen(false);
                  }}
                  >
                    Login
                  </button>
                )
              }
            </div>


          </div>

        )}
      </div>
      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        openOtp={(id) => {
          setUserId(id);
          setAuthOpen(false);
          setOtpOpen(true);
        }}
        openForgotPassword={() => {
          setAuthOpen(false);
          setForgotPasswordOpen(true);
        }}
      />
      <ForgotPasswordModal
        isOpen={forgotPasswordOpen}
        onClose={() => setForgotPasswordOpen(false)}
        openOtp={(id) => {
          setUserId(id);
          setForgotPasswordOpen(false);
          setOtpOpen(true);
        }}
        openLogin={() => {
          setForgotPasswordOpen(false);
          setAuthOpen(true);
        }}
      />
      <OtpModal
        isOpen={otpOpen}
        onClose={() => setOtpOpen(false)}
        onVerify={(otp) => {
          if (userId) {
            dispatch(verifyOtpUser({ user_id: userId, otp }))
              .unwrap()
              .then(() => {
                setOtpOpen(false);
                alert("Login Successfull!");
              })
              .catch((err: any) => {
                alert(err || "Invalid OTP");
              });
          } else {
            alert("User ID missing, please try logging in again.");
          }
        }}
      />
    </>
  );
};

export default Navbar;



