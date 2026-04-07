"use client"
import React, { useEffect, useState, useCallback } from 'react'
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
import VerifyOTPResetPasswordModal from './VerifyOTPResetPasswordModal';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { logout, verifyOtpUser, openLoginModal, closeLoginModal, clearRedirectPath } from '@/redux/features/authSlice';
import { fetchCartSummary } from '@/redux/features/cartSlice';
import { RootState } from "@/redux/store";
import { FaCartShopping, FaUser } from 'react-icons/fa6';
import { LiaShoppingCartSolid } from 'react-icons/lia';
import Link from 'next/link';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { toast } from 'react-toastify';
import { productAPI } from '@/services/api';
import { debounce } from '@/utils/debounce';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  // const [authOpen, setAuthOpen] = useState(false);
  const [otpOpen, setOtpOpen] = useState(false);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [verifyResetPasswordOpen, setVerifyResetPasswordOpen] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);
  const dispatch = useDispatch<AppDispatch>();

  const { user, token, isLoginModalOpen, redirectPath } = useSelector((state: RootState) => state.auth);
  const { totalQuantity } = useSelector((state: RootState) => state.cart);
  // console.log(user?.name);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchCartSummary(user.id));
    }
  }, [user?.id, dispatch]);

  // Sync search state with URL if on allProduct page
  useEffect(() => {
    if (pathname === '/allProduct') {
      const querySearch = searchParams.get('search') || '';
      setSearch(querySearch);
    }
  }, [pathname, searchParams]);

  const performSearch = useCallback(
    debounce(async (query: string) => {
      if (!query.trim()) {
        setSearchResults([]);
        setIsSearching(false);
        return;
      }

      if (pathname === '/allProduct') {
        const params = new URLSearchParams(searchParams.toString());
        params.set('search', query);
        params.set('page', '1');
        router.push(`/allProduct?${params.toString()}`, { scroll: false });
        setIsSearching(false);
        return;
      }

      setIsSearching(true);
      try {
        const response = await productAPI.getProducts(`search=${query}&limit=5`);
        // The API returns { status, code, data: { data: [...] } }
        setSearchResults(response?.data?.data || []);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setIsSearching(false);
      }
    }, 500),
    [pathname, router, searchParams]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    setShowDropdown(true);
    performSearch(value);
  };

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!(event.target as HTMLElement).closest('.search-box')) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);
  // console.log(token)
  const handleLogout = () => {
    router.replace("/");
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

            <Link href="/" className="logo">
              <Image src={"/logo.png"} alt='logo' height={50} width={120} />

            </Link>
          </div>

          <div className="search-box">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search for mobiles, accessories & More"
              value={search}
              onChange={handleChange}
              onFocus={() => setShowDropdown(true)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setShowDropdown(false);
                  router.push(`/allProduct?search=${search}`);
                }
              }}
            />

            {showDropdown && (search.trim() || isSearching) && pathname !== '/allProduct' && (
              <div className="search-results-dropdown">
                {isSearching ? (
                  <div className="search-loading">Searching...</div>
                ) : searchResults.length > 0 ? (
                  <>
                    {searchResults.map((product) => (
                      <Link
                        key={product.id}
                        href={`/product/${product.id}`}
                        className="search-result-item"
                        onClick={() => setShowDropdown(false)}
                      >
                        <img
                          src={product.variants?.[0]?.images?.[0]?.image_url || '/placeholder.png'}
                          alt={product.name}
                        />
                        <div className="result-info">
                          <span className="result-name">{product.name}</span>
                          <span className="result-price">₹{Number(product.variants?.[0]?.pricing?.selling_price || 0).toLocaleString('en-IN')}</span>
                        </div>
                      </Link>
                    ))}
                    <Link
                      href={`/allProduct?search=${search}`}
                      className="view-all-results"
                      onClick={() => setShowDropdown(false)}
                    >
                      View all results for "{search}"
                    </Link>
                  </>
                ) : (
                  <div className="no-results">No products found</div>
                )}
              </div>
            )}
          </div>

          <div className="nav-actions">
            <div className="location">
              <FiMapPin />
              <span>Rameswaram</span>
              <FiChevronDown size={14} />
            </div>
            {mounted && token ? (
              <div className="cart" onClick={() => router.push("/cart")}>
                <LiaShoppingCartSolid size={30} />

                {totalQuantity > 0 && (
                  <span className="cart-badge">
                    {totalQuantity > 99 ? "99+" : totalQuantity}
                  </span>
                )}
              </div>
            ) : null}

            {
              mounted && token ? (
                <div className='user-profile-wrapper'>
                  <div className="user-profile" onClick={() => setProfileOpen(!profileOpen)}>
                    <FaUser />
                    <span>{user?.name || 'User'}</span>
                    <FiChevronDown size={14} />
                  </div>
                  {
                    profileOpen && (
                      <div className="profile-dropdown" onClick={() => setProfileOpen(false)}>
                        <div className="dropdown-item">Orders</div>
                        <Link href={'/my-account'}><div className="dropdown-item">My Account</div></Link>
                        <div className="dropdown-item" onClick={handleLogout}>
                          Logout
                        </div>
                      </div>
                    )
                  }
                </div>
                // <button className="logout-btn" onClick={handleLogout}>Logout</button>
              ) : (
                <button className="login-btn" onClick={() => dispatch(openLoginModal())}>
                  Login
                </button>
              )
            }

          </div>
        </div>

        {/* <div className="nav-bottom">
          <div className="menu-item">All <FiChevronDown size={14} /></div>
          <div className="menu-item">Sell Phone <FiChevronDown size={14} /></div>
          <div className="menu-item">Sell Gadgets <FiChevronDown size={14} /></div>
          <div className="menu-item">Buy Refurbished Devices <FiChevronDown size={14} /></div>
          <div className="menu-item">Buy Laptop <FiChevronDown size={14} /></div>
          <div className="menu-item">More <FiChevronDown size={14} /></div>
        </div> */}

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
                mounted && token ? (
                  <button className="logout-btns" onClick={handleLogout}>Logout</button>
                ) : (
                  <button className="login-btns" onClick={() => {
                    dispatch(openLoginModal());
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
        isOpen={isLoginModalOpen}
        onClose={() => dispatch(closeLoginModal())}
        openOtp={(id) => {
          setUserId(id);
          dispatch(closeLoginModal());
          setOtpOpen(true);
        }}
        openForgotPassword={() => {
          dispatch(closeLoginModal());
          setForgotPasswordOpen(true);
        }}
      />
      <ForgotPasswordModal
        isOpen={forgotPasswordOpen}
        onClose={() => setForgotPasswordOpen(false)}
        openOtp={(id) => {
          setUserId(id);
          setForgotPasswordOpen(false);
          setVerifyResetPasswordOpen(true);
        }}
        openLogin={() => {
          setForgotPasswordOpen(false);
          dispatch(openLoginModal());
        }}
      />
      <VerifyOTPResetPasswordModal
        isOpen={verifyResetPasswordOpen}
        onClose={() => setVerifyResetPasswordOpen(false)}
        userId={userId}
        openLogin={() => {
          setVerifyResetPasswordOpen(false);
          dispatch(openLoginModal());
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
                toast.success("Login Successful!");

                // Handle redirect if exists
                if (redirectPath) {
                  router.push(redirectPath);
                  dispatch(clearRedirectPath());
                }
              })
              .catch((err: any) => {
                toast.error(err || "Invalid OTP");
              });
          } else {
            toast.error("User ID missing, please try logging in again.");
          }
        }}
      />
    </>
  );
};

export default Navbar;



