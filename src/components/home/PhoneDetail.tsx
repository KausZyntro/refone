"use client"
import React from "react";
import "@/styles/PhoneDetail.css";

const categories = [
  { name: "iPhone 17 Pro", img: "https://www.apple.com/in/iphone/home/images/overview/chapternav/nav_iphone_17pro__d60uog2c064i_large_2x.png" },
  { name: "iPhone Air", img: "https://www.apple.com/v/iphone/home/ci/images/overview/chapternav/nav_iphone_air__bbj6j2c39efm_large_2x.png" },
  { name: "iPhone 17", img: "https://www.apple.com/in/iphone/home/images/overview/chapternav/nav_iphone_17__ffxyxejeezqm_large_2x.png" },
  { name: "iPhone 16", img: "https://www.apple.com/in/iphone/home/images/overview/chapternav/nav_iphone_16__kcscr25z9num_large_2x.png" },
  { name: "iPhone 16e", img: "https://www.apple.com/in/iphone/home/images/overview/chapternav/nav_iphone_16e__3qxl86zrk0yq_large_2x.png" },
  { name: "iPhone 11 Series", img: "https://www.apple.com/v/iphone/home/ci/images/overview/chapternav/nav_compare__fka067e4fgq6_large_2x.png" },
  { name: "iPhone SE", img: "https://www.apple.com/v/iphone/home/ci/images/overview/chapternav/nav_accessories__e5zgfl9e0vwy_large_2x.png" },
  { name: "iPhone X Series", img: "https://www.apple.com/in/iphone/home/images/overview/chapternav/nav_shop_alt__dur38g1c4ii6_large_2x.png" },
  { name: "All Phones", isAll: true },
];



const PhoneDetail = () => {
  return (
    <section className="category-section">
      <div className="category-header">
        <h2>Shop By Category</h2>
        <a href="/allProduct">View All</a>
      </div>

      <div className="category-grid">
        {categories.map((cat, index) => (
          <a href="/allProduct" key={index} className="category-item">
            <div className="category-icon-wrapper">
              {cat.isAll ? (
                <div className="all-categories-icon">
                  <img src="https://img.icons8.com/ios/50/666666/menu--v1.png" alt="all" style={{ width: '30px', height: '30px' }} />
                </div>
              ) : (
                <img src={cat.img} alt={cat.name} />
              )}
            </div>
            <p className="category-name">{cat.name}</p>
          </a>
        ))}
      </div>
    </section>
  );
};

export default PhoneDetail;
