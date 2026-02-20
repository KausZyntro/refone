import React from "react";
import "./productDetail.css";
import ProductGallery from "@/component/product/ProductGallery";
import ProductInfo from "@/component/product/ProductInfo";
import RelatedProduct from "@/component/product/RelatedProducts";
const Page = () => {
  const images = [
    "https://cdn.thewirecutter.com/wp-content/media/2025/09/BG-IPHONE-2048px_IPHONE-17-PRO-MAX_BACK.jpg?auto=webp&quality=75&width=1024f",
    "https://inventstore.in/wp-content/uploads/2023/04/iPhone_13_Green.webp",
    "https://media-ik.croma.com/prod/https://media.tatacroma.com/Croma%20Assets/Communication/Mobiles/Images/309744_0_ht3s5b.png",
    "https://darlingretail.com/cdn/shop/files/iPhone_15_Pink_Pure_Back_iPhone_15_Pink_Pure_Front_2up_Screen__WWEN_cfd96ace-df87-4ab3-a96a-e8e9b13bb7b9_800x.jpg?v=1695104022"
  ];

  return (
    <div className="product-detail-container">
      <div className="product-top">
        <ProductGallery images={images} />
        <ProductInfo />
      </div>

      <RelatedProduct />
    </div>
  );
};

export default Page;