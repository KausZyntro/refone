import React from "react";
import "./productDetail.css";
import ProductGallery from "@/component/product/ProductGallery";
import ProductInfo from "@/component/product/ProductInfo";
import ProductSlider from "@/component/home/ProductSlider";
import TrustBadge from "@/component/product/TrustBadge";
import ReviewsSection from "@/component/product/ReviewSection";
const Page = () => {
  const images = [
    "https://cdn.thewirecutter.com/wp-content/media/2025/09/BG-IPHONE-2048px_IPHONE-17-PRO-MAX_BACK.jpg?auto=webp&quality=75&width=1024f",
    "https://inventstore.in/wp-content/uploads/2023/04/iPhone_13_Green.webp",
    "https://media-ik.croma.com/prod/https://media.tatacroma.com/Croma%20Assets/Communication/Mobiles/Images/309744_0_ht3s5b.png",
    "https://darlingretail.com/cdn/shop/files/iPhone_15_Pink_Pure_Back_iPhone_15_Pink_Pure_Front_2up_Screen__WWEN_cfd96ace-df87-4ab3-a96a-e8e9b13bb7b9_800x.jpg?v=1695104022"
  ];
    const relatedProducts = [
   {
    id:1,
  name: "Apple iPhone 15 (128GB)",
  slug: "long-sleeve-hoodie",
  price: 75000,
  mrp: 79900,
  discount: Math.round((79900-75000)/79900*100),
  rating: 4.6,
  image: "https://media-ik.croma.com/prod/https://media.tatacroma.com/Croma%20Assets/Communication/Mobiles/Images/300825_0_dwjpem.png"
},
{
  id:2,
  name: "Apple iPhone 15 Plus (128GB)",
  slug: "long-sleeve-hoodie",
  price: 85000,
  mrp: 89900,
  discount: Math.round((89900-85000)/89900*100),
  rating: 4.5,
  image: "https://m.media-amazon.com/images/I/71zFRCcMS2L.jpg"
},
{
  id:3,
  name: "Apple iPhone 14 (128GB)",
  slug: "long-sleeve-hoodie",
  price: 60000,
  mrp: 69900,
  discount: Math.round((69900-60000)/69900*100),
  rating: 4.4,
  image: "https://maplestore.in/cdn/shop/files/I14Red_1_292e4387-62da-4daf-aebb-346ea49f465b.png?v=1770784619"
},
{
  id:4,
  name: "Apple iPhone 13 (128GB)",
  slug: "long-sleeve-hoodie",
  price: 50000,
  mrp: 59900,
  discount: Math.round((59900-50000)/59900*100),
  rating: 4.3,
  image: "https://media-ik.croma.com/prod/https://media.tatacroma.com/Croma%20Assets/Communication/Mobiles/Images/243463_0_VUvKBDeS9z.png?updatedAt=1755780540261"
},
{
  id:5,
  name: "Apple iPhone 15 Pro (256GB)",
  slug: "long-sleeve-hoodie",
  price: 100000,
  mrp: 129800,
  discount: Math.round((129800-100000)/129800*100),
  rating: 4.7,
  image: "https://media.tatacroma.com/Croma%20Assets/Communication/Mobiles/Images/300784_0_lwcezu.png"
}

  ];

  return (
    <div className="product-detail-container">
      <div className="product-top">
        <ProductGallery images={images} />
        <ProductInfo />
      </div>
      <ProductSlider products={relatedProducts}/>
      <TrustBadge/>
      <ReviewsSection/>
    </div>
  );
};

export default Page;