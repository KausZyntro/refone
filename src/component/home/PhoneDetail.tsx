"use client"
import React, { useRef } from "react";
import "@/styles/PhoneDetail.css";

const products = [
  { name: "iPhone 17 Pro", link: "/in/iphone-17-pro/", img: "https://www.apple.com/in/iphone/home/images/overview/chapternav/nav_iphone_17pro__d60uog2c064i_large_2x.png" },
  { name: "iPhone Air", link: "/in/iphone-air/", img: "https://www.apple.com/v/iphone/home/ci/images/overview/chapternav/nav_iphone_air__bbj6j2c39efm_large_2x.png" },
  { name: "iPhone 17", link: "/in/iphone-17/", img: "https://www.apple.com/in/iphone/home/images/overview/chapternav/nav_iphone_17__ffxyxejeezqm_large_2x.png" },
  { name: "iPhone 16", link: "/in/shop/goto/buy_iphone/iphone_16", img: "https://www.apple.com/in/iphone/home/images/overview/chapternav/nav_iphone_16__kcscr25z9num_large_2x.png" },
  { name: "iPhone 16e", link: "/in/iphone-16e/", img: "https://www.apple.com/in/iphone/home/images/overview/chapternav/nav_iphone_16e__3qxl86zrk0yq_large_2x.png" },
  { name: "Compare", link: "/in/iphone/compare/", img: "https://www.apple.com/v/iphone/home/ci/images/overview/chapternav/nav_compare__fka067e4fgq6_large_2x.png" },
  { name: "Accessories", link: "/in/shop/goto/iphone/accessories", img: "https://www.apple.com/v/iphone/home/ci/images/overview/chapternav/nav_accessories__e5zgfl9e0vwy_large_2x.png" },
  { name: "Shop iPhone", link: "/in/shop/goto/buy_iphone", img: "https://www.apple.com/in/iphone/home/images/overview/chapternav/nav_shop_alt__dur38g1c4ii6_large_2x.png" },
];

const PhoneDetail = () => {
  const scrollRef = useRef(null);

  const scroll = (direction:any) => {
    const { current } = scrollRef;
    if (direction === "left") {
      current.scrollBy({ left: -300, behavior: "smooth" });
    } else {
      current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  return (
    <section className="container">
      <header className="phone-hero-header">
        <h1>iPhone</h1>
      </header>

      <nav className="chapter-nav">
        <button className="nav-btn left" onClick={() => scroll("left")}>
          ‹
        </button>

        <ul className="product-list" ref={scrollRef}>
          {products.map((product, index) => (
            <li key={index} className="product-item">
              <a href={product.link}>
                <img src={product.img} alt={product.name} />
                <p>{product.name}</p>
              </a>
            </li>
          ))}
        </ul>

        <button className="nav-btn right" onClick={() => scroll("right")}>
          ›
        </button>
      </nav>
    </section>
  );
};

export default PhoneDetail;
