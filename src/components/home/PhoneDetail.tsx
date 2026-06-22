"use client"
import React from "react";
import "@/styles/PhoneDetail.css";

const categories = [
  {
    name: "iPhone 14",
    id: "7",
    slug: "iphone-14",
    img: "/images/iPhone14.jpg",
  },
  {
    name: "iPhone 14 Pro",
    id: "6",
    slug: "iphone-14-pro",
    img: "/images/iPhone14Pro.jpg",
  },
  {
    name: "iPhone 13",
    id: "8",
    slug: "iphone-13",
    img: "/images/iphone131.jpg",
  },
  {
    name: "iPhone 15",
    id: "4",
    slug: "iphone-15",
    img: "/images/iPhone15Pink.webp",
  },
  {
    name: "iPhone 15 Pro",
    id: "2",
    slug: "iphone-15-pro",
    img: "/images/iphone15pro.webp",
  },
  {
    name: "iPhone 15 Plus",
    id: "3",
    slug: "iphone-15-plus",
    img: "/images/iphone15plus.jpeg",
  },
  // {
  //   name: "iPhone 14 Pro Max",
  //   id: "5",
  //   slug: "iphone-14-pro-max",
  //   img: "/images/iphone14promax.webp",
  // },
  {
    name: "All Phones",
    slug: "allProduct?page=1",
    isAll: true,
  },
];
 console.log("this is cat")
 console.log(categories)

const PhoneDetail = () => {
  return (
    <section className="category-section">
      <div className="category-header">
        <h2>Shop By Category</h2>
        <a href="/allProduct">View All</a>
      </div>

      <div className="category-grid">
        {categories.map((cat, index) => (
          <a href= {cat.isAll ? `${cat.slug}` : `/product/${cat.id}/${cat.slug}`} key={index} className="category-item">
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
