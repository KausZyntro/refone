"use client"
import React, { useEffect, useState, useCallback } from 'react'
import dynamic from 'next/dynamic';
import "@/styles/Navbar.css";

import { FiSearch, FiMapPin } from "react-icons/fi";
import Image from 'next/image';

// Auth dialogs are only needed after a click. Loading them on demand keeps the
// Lottie player, animation JSON and Firebase out of the initial page bundle.
const AuthModal = dynamic(() => import('./AuthModal'), { ssr: false });
const OtpModal = dynamic(() => import('./OtpModal'), { ssr: false });
const ForgotPasswordModal = dynamic(() => import('./ForgotPasswordModal'), { ssr: false });
const VerifyOTPResetPasswordModal = dynamic(() => import('./VerifyOTPResetPasswordModal'), { ssr: false });
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { logout, verifyOtpUser, openLoginModal, closeLoginModal, clearRedirectPath } from '@/redux/features/authSlice';
import { fetchCartSummary } from '@/redux/features/cartSlice';
import { RootState } from "@/redux/store";
import { FaUser } from 'react-icons/fa6';
import { LiaShoppingCartSolid } from 'react-icons/lia';
import Link from 'next/link';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { toast } from 'react-toastify';
import { productAPI } from '@/services/api';
import { debounce } from '@/utils/debounce';
import { FaCheckCircle, FaHistory, FaShieldAlt } from "react-icons/fa";

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
  const searchCacheRef = React.useRef<Record<string, any[]>>({});
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
    const [city, setCity] = useState("Loading...");
  const abortControllerRef = React.useRef<AbortController | null>(null);

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // Defer the badge refresh until the browser is idle so it never competes with
  // the initial render. The slice also dedupes repeated calls for the same user.
  useEffect(() => {
    if (!user?.id) return;
    const userId = user.id;
    const run = () => {
      dispatch(fetchCartSummary(userId));
    };

    if (typeof window !== "undefined" && typeof window.requestIdleCallback === "function") {
      const handle = window.requestIdleCallback(run, { timeout: 3000 });
      return () => window.cancelIdleCallback(handle);
    }

    const timeout = setTimeout(run, 1500);
    return () => clearTimeout(timeout);
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


  const CITY_KEY = "user_city";
const CITY_TS_KEY = "user_city_ts";
const ONE_DAY = 24 * 60 * 60 * 1000;


const handleClickForDownload = () => {
  router.push('/#download-app-section');
};
const handleClickForHelpCenter = () => {
  router.push('/#help-center');
};

// useEffect(() => {
//   const savedCity = localStorage.getItem(CITY_KEY);
//   const savedTime = localStorage.getItem(CITY_TS_KEY);

//   // ✅ If cached and not expired → use it
//   if (savedCity && savedTime) {
//     const age = Date.now() - Number(savedTime);
//     if (age < ONE_DAY) {
//       setCity(savedCity);
//       return;
//     }
//   }

//   // ✅ Optional: check permission BEFORE triggering popup
//   if ("permissions" in navigator) {
//     navigator.permissions
//       .query({ name: "geolocation" as PermissionName })
//       .then((result) => {
//         if (result.state === "denied") {
//           setCity("Select Location");
//           return;
//         }

//         if (result.state === "granted" || result.state === "prompt") {
//           getLocation();
//         }
//       })
//       .catch(() => getLocation());
//   } else {
//     getLocation();
//   }

//   async function getLocation() {
//     if (!("geolocation" in navigator)) {
//       setCity("Not Supported");
//       return;
//     }

//     navigator.geolocation.getCurrentPosition(
//       async (position) => {
//         const { latitude, longitude } = position.coords;

//         try {
//           const response = await fetch(
//             `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
//           );

//           const data = await response.json();

//           const cityName =
//             data.address.city ||
//             data.address.town ||
//             data.address.village ||
//             data.address.state_district ||
//             "Unknown Location";

//           setCity(cityName);

//           // ✅ SAVE to cache
//           localStorage.setItem(CITY_KEY, cityName);
//           localStorage.setItem(CITY_TS_KEY, Date.now().toString());
//         } catch (error) {
//           setCity("Location Error");
//         }
//       },
//       () => {
//         setCity("Select Location");
//       },
//       { timeout: 10000 }
//     );
//   }
// }, []);


const getLocation = async () => {
  if (!navigator.geolocation) {
    setCity("Not Supported");
    return;
  }

  if ("permissions" in navigator) {
    const permission = await navigator.permissions.query({
      name: "geolocation" as PermissionName,
    });

    if (permission.state === "denied") {
      setCity("Enable Location in Settings");
      return;
    }
  }

  setCity("Fetching...");

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const { latitude, longitude } = position.coords;

      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
        );

        const data = await response.json();

        const cityName =
          data.address.city ||
          data.address.town ||
          data.address.village ||
          data.address.state_district ||
          "Unknown Location";

        setCity(cityName);

        // ✅ save in localStorage
        localStorage.setItem("user_city", cityName);
        localStorage.setItem("user_city_ts", Date.now().toString());

      } catch (err) {
        console.error(err);
        setCity("Location Error");
      }
    },
    (error) => {
      console.error("Geolocation error:", error.message);

  switch (error.code) {
    case error.PERMISSION_DENIED:
      setCity("Permission Denied");
      break;
    case error.POSITION_UNAVAILABLE:
      setCity("Location Unavailable");
      break;
    case error.TIMEOUT:
      setCity("Request Timeout");
      break;
    default:
      setCity("Select Location");
  }
      // setCity("Select Location");
    },
    { timeout: 10000 }
  );
};
useEffect(() => {
  const savedCity = localStorage.getItem("user_city");

  if (savedCity) {
    setCity(savedCity);
  } else {
    setCity("Select Location");
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
      const cachedResults = searchCacheRef.current[trimmedQuery];
      if (cachedResults) {
        setSearchResults(cachedResults);
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
        searchCacheRef.current[trimmedQuery] = results;

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
    [pathname, router, searchParams, saveToHistory]
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
      if (!(event.target as HTMLElement).closest('.account-nav-item')) {
        setProfileOpen(false);
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
        <div className="nav-utility">
          <div className="utility-left">
            <div className="utility-item">
              <FaCheckCircle color="#006aaf" size={16} />
              100% Original Products
            </div>
            <div className="utility-item">
              <FaHistory color="#006aaf" size={16} />
              Easy 7-Day Replacement
            </div>
            <div className="utility-item">
             <FaShieldAlt color="#006aaf" size={16} />
              12 Months Warranty
            </div>
          </div>
          <div className="utility-right">
            <div className="utility-item" onClick={handleClickForDownload}><Image src="https://img.icons8.com/ios/16/666666/smartphone.png" alt="app" width={16} height={16} sizes="16px" /> Download App</div>
            {/* <div className="utility-item" onClick={getLocation}><FiMapPin /> Store Locator</div> */}
            <div className="utility-item"><Image src="https://img.icons8.com/ios/16/666666/truck.png" alt="order" width={16} height={16} sizes="16px" /> Track Order</div>
            <div className="utility-item" onClick={handleClickForHelpCenter}><Image src="https://img.icons8.com/ios/16/666666/help.png" alt="help" width={16} height={16} sizes="16px" /> Help Center</div>
          </div>
        </div>

        <div className="nav-top">
          <div className="nav-top-wrapper">
            <div className="nav-left">
              <div className="leftSection">
                {/* <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
                  {menuOpen ? <FiX size={24} /> : <HiMenuAlt2 size={24} />}
                </div> */}

                <Link href="/" className="logo">
                  <Image src={"/logo-original.png"} alt="logo" height={40} width={120} />
                </Link>
              </div>
            </div>

            <div className="search-box">
              <input
                type="text"
                placeholder="Search for Iphones"
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
              <button className="search-btn" onClick={() => router.push(`/allProduct?search=${search}`)}>
                <FiSearch size={18} />
              </button>

              {showDropdown && pathname !== '/allProduct' && (
                <div className="search-results-dropdown">
                  {/* ... dropdown content remains same ... */}
                  {isSearching ? (
                    <div className="search-loading">Searching...</div>
                  ) : mounted && search.trim().length === 0 && recentSearches.length > 0 ? (
                    <div className="recent-searches">
                      <div className="dropdown-title">Recent Searches</div>
                      {recentSearches.map((item, index) => (
                        <div key={index} className="recent-item" onClick={() => { setSearch(item); performSearch(item); }}>
                          <FiSearch size={14} />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  ) : search.trim().length >= 3 && searchResults.length > 0 ? (
                    <>
                      {searchResults.map((product) => (
                        <Link key={product.id} href={`/product/${product.id}`} className="search-result-item" onClick={() => { setShowDropdown(false); saveToHistory(search); }}>
                          <Image src={product.variants?.[0]?.images?.[0]?.image_url || '/placeholder.png'} alt={product.name} width={40} height={40} sizes="40px" />
                          <div className="result-info">
                            <span className="result-name">{product.name}</span>
                            <span className="result-price">₹{Number(product.variants?.[0]?.pricing?.selling_price || 0).toLocaleString('en-IN')}</span>
                          </div>
                        </Link>
                      ))}
                    </>
                  ) : null}
                </div>
              )}
            </div>

            <div className="nav-actions">
              {mounted && token ? (
                <div className="nav-action-item account-nav-item" onClick={() => setProfileOpen(!profileOpen)}>
                  <FaUser size={20} />
                  <div className="nav-action-info">
                    <span className="label">Account</span>
                    <span className="sub-label">{user?.name || 'My Profile'}</span>
                  </div>
                  {profileOpen && (
                    <div className="profile-dropdown">
                      <div className="dropdown-item" onClick={() => { router.push('/my-account'); setProfileOpen(false); }}>
                        My Account
                      </div>
                      <div className="dropdown-item" onClick={() => { router.push('/my-orders'); setProfileOpen(false); }}>
                        My Orders
                      </div>
                      <div className="dropdown-item" onClick={() => { handleLogout(); setProfileOpen(false); }}>
                        Logout
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="nav-action-item" onClick={() => dispatch(openLoginModal())}>
                  <FaUser size={20} />
                  <div className="nav-action-info">
                    <span className="label">Login / Sign Up</span>
                    <span className="sub-label">Account</span>
                  </div>
                </div>
              )}

              <div className="nav-action-item" onClick={() => router.push("/cart")}>
                <div style={{ position: 'relative' }}>
                  <LiaShoppingCartSolid size={26} />
                  {mounted && totalQuantity > 0 && (
                    <span className="cart-badge">
                      {totalQuantity > 99 ? "99+" : totalQuantity}
                    </span>
                  )}
                </div>
                <div className="nav-action-info">
                  <span className="label">Cart</span>
                </div>
              </div>
            </div>
          </div>
        </div>


        {menuOpen && (
          <div className="mobile-menu">
            <Link href={'/my-account'}>
              <div className="mobile-item" onClick={() => setMenuOpen(false)}>My Account</div>
            </Link>
            <div className="mobile-item">
              <div className="locations">
                <FiMapPin />
                <span>{city}</span>
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
      {isLoginModalOpen && (
      <AuthModal
        isOpen
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
      )}
      {forgotPasswordOpen && (
      <ForgotPasswordModal
        isOpen
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
      )}
      {verifyResetPasswordOpen && (
      <VerifyOTPResetPasswordModal
        isOpen
        onClose={() => setVerifyResetPasswordOpen(false)}
        userId={userId}
        openLogin={() => {
          setVerifyResetPasswordOpen(false);
          dispatch(openLoginModal());
        }}
      />
      )}
      {otpOpen && (
      <OtpModal
        isOpen
        onClose={() => setOtpOpen(false)}
        onVerify={(otp) => {
          if (userId) {
            dispatch(verifyOtpUser({ user_id: userId, otp }))
              .unwrap()
              .then((res: any) => {
                setOtpOpen(false);
                toast.success("Login Successful!");

                const userObj = res?.user || res?.data?.user || res;
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
      )}
    </>
  );
};

export default Navbar;
