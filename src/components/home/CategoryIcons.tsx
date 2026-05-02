"use client"
import React, { useRef } from "react";
import "@/styles/CategoryIcons.css";

const categories = [
  { name: "iPhones", link: "/allProduct", img: "https://www.apple.com/in/iphone/home/images/overview/chapternav/nav_iphone_17pro__d60uog2c064i_large_2x.png" },
  { name: "Samsung", link: "/allProduct", img: "https://images.samsung.com/is/image/samsung/p6pim/in/2401/gallery/in-galaxy-s24-s928-sm-s928bztqins-thumb-539573338?$216_216_PNG$" },
  { name: "OnePlus", link: "/allProduct", img: "https://image01.oneplus.net/ebp/202312/05/1-m00-50-6a-cpgm7gv14-aawu5paam2lsvf_8u187.png" },
  { name: "Google", link: "/allProduct", img: "https://lh3.googleusercontent.com/xH4bQdZlKqYtG5-tQ2n5x2Q0n5D1lX4j6w2f7k5y9c0g_r6h2x9k7y5z8_a9w3t5d6x7_8=s120" },
  { name: "Nothing", link: "/allProduct", img: "https://in.nothing.tech/cdn/shop/files/pc-1_1080x.png?v=1709635035" },
  { name: "Realme", link: "/allProduct", img: "https://image01.realme.net/general/20240124/17060856984364025d5d6a2f34731802e8615b3a32f38.png" },
  { name: "Vivo", link: "/allProduct", img: "https://in-exstatic-vivofs.vivo.com/gdHFRinHEMrj3yPW/1695286467364/e33d26fbac5f88421b4a62fc1d0dc522.png" },
  { name: "Oppo", link: "/allProduct", img: "https://image.oppo.com/content/dam/oppo/common/mkt/v2-2/reno11-pro-5g/navigation/Reno11-Pro-pearl-white-427_600-pc.png.thumb.webp" },
  { name: "All Phones", link: "/allProduct", icon: "📱" },
];

const CategoryIcons = () => {
  const scrollRef = useRef<any>(null);

  const scroll = (direction: any) => {
    const { current } = scrollRef;
    if (direction === "left") {
      current?.scrollBy({ left: -300, behavior: "smooth" });
    } else {
      current?.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  return (
    <section className="container" style={{ marginTop: '16px', marginBottom: '16px' }}>
      <header className="category-header">
        <h2>Shop By Category</h2>
        <a href="/allProduct" className="view-all-link">View All</a>
      </header>

      <div className="category-nav">
        <button className="nav-btn-cat left" onClick={() => scroll("left")}>
          ‹
        </button>

        <ul className="category-list" ref={scrollRef}>
          {categories.map((cat, index) => (
            <li key={index} className="category-item">
              <a href={cat.link} className="category-card">
                <div className="category-img-wrapper">
                  {cat.img ? (
                    <img src={cat.img} alt={cat.name} />
                  ) : (
                    <span className="category-emoji">{cat.icon}</span>
                  )}
                </div>
                <p>{cat.name}</p>
              </a>
            </li>
          ))}
        </ul>

        <button className="nav-btn-cat right" onClick={() => scroll("right")}>
          ›
        </button>
      </div>
    </section>
  );
};

export default CategoryIcons;
