"use client"
import React from "react";
import "@/styles/PhoneDetail.css";

const categories = [
  { name: "iPhone 14",id:"8", img: "/images/iphone-14.jpg" },
  { name: "iPhone 14 Pro",id:"6", img: "/images/iphone-14-Pro.jpg" },
  { name: "iPhone 13", id:"9", img: "/images/iphone131.jpg" },
  { name: "iPhone 15", id:"4", img: "/images/iPhone_15_Pink.webp" },
  { name: "iPhone 15 Pro", id:"2", img: "/images/iPhone 15 pro.webp" },
  { name: "iPhone 15 Pro Max", id:"1", img: "/images/iPhone 15 pro max.webp" },
  { name: "iPhone 15 Plus", id:"3", img: "/images/iPhone 15 plus.jpeg" },
  { name: "iPhone 14 Pro Max", id:"5", img: "/images/iphone 14 pro max.webp" },
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
          <a href={`/product/${cat.id}`} key={index} className="category-item">
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
