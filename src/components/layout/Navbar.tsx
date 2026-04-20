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

const SEARCH_HISTORY_KEY = 'recent_searches';
const MAX_HISTORY = 5;

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
  const [searchCache, setSearchCache] = useState<Record<string, any[]>>({});
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
    const [city, setCity] = useState("Loading...");
  const abortControllerRef = React.useRef<AbortController | null>(null);

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchCartSummary(user.id));
    }
  }, [user?.id, dispatch]);

  // Load search history
  useEffect(() => {
    const history = localStorage.getItem(SEARCH_HISTORY_KEY);
    if (history) {
      try {
        setRecentSearches(JSON.parse(history));
      } catch (e) {
        console.error("Error parsing search history", e);
      }
    }
  }, []);

  const saveToHistory = useCallback((query: string) => {
    if (!query.trim() || query.length < 3) return;
    setRecentSearches(prev => {
      const filtered = prev.filter(item => item.toLowerCase() !== query.toLowerCase());
      const updated = [query, ...filtered].slice(0, MAX_HISTORY);
      localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Sync search state with URL if on allProduct page
  useEffect(() => {
    if (pathname === '/allProduct') {
      const querySearch = searchParams.get('search') || '';
      setSearch(querySearch);
    }
  }, [pathname, searchParams]);



useEffect(() => {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );

          const data = await response.json();
          console.log(data)

          const cityName =
            data.address.city ||
            data.address.town ||
            data.address.village ||
            data.address.state_district ||
            "Unknown Location";

          setCity(cityName);
        } catch (error) {
          console.error("Error fetching city:", error);
          setCity("Location Error");
        }
      },
      (error) => {
        // console.warn("Geolocation error:", error.message);
        setCity("Select Location");
      }
    );
  } else {
    setCity("Not Supported");
  }
}, []);

  const performSearch = useCallback(
    debounce(async (query: string) => {
      const trimmedQuery = query.trim().toLowerCase();

      if (trimmedQuery.length < 3) {
        setSearchResults([]);
        setIsSearching(false);
        return;
      }

      // Check cache
      if (searchCache[trimmedQuery]) {
        setSearchResults(searchCache[trimmedQuery]);
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

      // Cancel previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      setIsSearching(true);
      try {
        const response = await productAPI.getProducts(`search=${query}&limit=5`, {
          signal: abortControllerRef.current.signal
        });

        if (abortControllerRef.current.signal.aborted) return;

        const results = response?.data?.data || [];
        setSearchResults(results);

        // Update cache
        setSearchCache(prev => ({ ...prev, [trimmedQuery]: results }));

        if (results.length > 0) {
          saveToHistory(query);
        }
      } catch (error: any) {
        if (error.name === 'AbortError' || error.name === 'CanceledError') {
          console.log("Search aborted");
        } else {
          console.error("Search error:", error);
        }
      } finally {
        setIsSearching(false);
      }
    }, 500),
    [pathname, router, searchParams, searchCache, saveToHistory]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);

    if (value.trim().length >= 3) {
      setShowDropdown(true);
      performSearch(value);
    } else {
      setSearchResults([]);
      if (value.trim().length === 0) {
        setShowDropdown(true); // Keep dropdown open to show recent searches
      } else {
        setShowDropdown(false);
      }
    }
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

          {/* <div className="nav-left">
            <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </div>

            <Link href="/" className="logo">
              <Image src={"/logo.png"} alt='logo' height={50} width={120} />

            </Link>
             <div className="mobileCart">
              {mounted ? (
              <div className="cart" onClick={() => router.push("/cart")}>
                <LiaShoppingCartSolid size={30} />

                {totalQuantity > 0 && (
                  <span className="cart-badge">
                    {totalQuantity > 99 ? "99+" : totalQuantity}
                  </span>
                )}
              </div>
            ) : null}
            </div>
           
          </div> */}

          <div className="nav-left">
  <div className="leftSection">
    <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
      {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
    </div>

    <Link href="/" className="logo">
      <Image src={"/logo.png"} alt="logo" height={50} width={120} />
    </Link>
  </div>

  <div className="mobileRightIcons">
    {mounted && (
      <>
      {token && (
        <Link href="/my-account" >
          <div className="mobileProfile" onClick={() => setProfileOpen(!profileOpen)}>
            <FaUser size={18} />
          </div>
        </Link>
      )}

        <div className="mobileCart">
          <div className="cart" onClick={() => router.push("/cart")}>
            <LiaShoppingCartSolid size={28} />

            {totalQuantity > 0 && (
              <span className="cart-badge">
                {totalQuantity > 99 ? "99+" : totalQuantity}
              </span>
            )}
          </div>
        </div>
      </>
    )}
  </div>
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

            {showDropdown && pathname !== '/allProduct' && (
              <div className="search-results-dropdown">
                {isSearching ? (
                  <div className="search-loading">Searching...</div>
                ) : search.trim().length === 0 && recentSearches.length > 0 ? (
                  <div className="recent-searches">
                    <div className="dropdown-title">Recent Searches</div>
                    {recentSearches.map((item, index) => (
                      <div
                        key={index}
                        className="recent-item"
                        onClick={() => {
                          setSearch(item);
                          performSearch(item);
                        }}
                      >
                        <FiSearch size={14} />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                ) : search.trim().length >= 3 && searchResults.length > 0 ? (
                  <>
                    {searchResults.map((product) => (
                      <Link
                        key={product.id}
                        href={`/product/${product.id}`}
                        className="search-result-item"
                        onClick={() => {
                          setShowDropdown(false);
                          saveToHistory(search);
                        }}
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
                      onClick={() => {
                        setShowDropdown(false);
                        saveToHistory(search);
                      }}
                    >
                      View all results for "{search}"
                    </Link>
                  </>
                ) : search.trim().length >= 3 ? (
                  <div className="no-results">No products found</div>
                ) : null}
              </div>
            )}
          </div>

          <div className="nav-actions">
            <div className="location">
              <FiMapPin />
              {/* <span>Rameswaram</span> */}
              <span>{city}</span>
              {/* <FiChevronDown size={14} /> */}
            </div>
            {mounted ? (
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
                        <Link href={'/my-orders'}>
                          <div className="dropdown-item">My Orders</div>
                        </Link>
                        <Link href={'/my-account'}><div className="dropdown-item">My Account</div></Link>
                        <div className="dropdown-item" onClick={handleLogout}>
                          Logout
                        </div>
                      </div>
                    )
                  }
                </div>
              ) : (
                <button className="login-btn" onClick={() => dispatch(openLoginModal())}>
                  Login
                </button>
              )
            }

          </div>
        </div>

        {menuOpen && (
          <div className="mobile-menu">
            <Link href={'/my-orders'}>
              <div className="mobile-item" onClick={() => setMenuOpen(false)}>My Orders</div>
            </Link>
            <Link href={'/my-account'}>
              <div className="mobile-item" onClick={() => setMenuOpen(false)}>My Account</div>
            </Link>
            {/* <div className="mobile-item">Sell Gadgets</div>
            <div className="mobile-item">Buy Refurbished Devices</div>
            <div className="mobile-item">Buy Laptop</div>
            <div className="mobile-item">More</div> */}
            <div className="mobile-item">
              <div className="locations">
                <FiMapPin />
                {/* <span>Rameswaram</span> */}
                <span>{city}</span>
                {/* <FiChevronDown size={14} /> */}
              </div>
            </div>
            <div className="mobile-item-btn">
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
              .then((res: any) => {
                setOtpOpen(false);
                toast.success("Login Successful!");

                const userObj = res?.user || res?.data?.user || res;
                // Check if it's a new user or missing profile details (name/email empty)
                const isNewUser = res?.is_new_user || res?.data?.is_new_user || !userObj?.name || userObj?.name.trim() === '' || !userObj?.email || userObj?.email.trim() === '';

                if (isNewUser) {
                  toast.info("Please fill your profile details.");
                  router.push('/my-account');
                } else if (redirectPath) {
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
