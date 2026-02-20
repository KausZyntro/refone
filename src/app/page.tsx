import Image from "next/image";
import styles from "./page.module.css";
import Navbar from "@/component/layout/Navbar";
import HeroSection from "@/component/home/HeroSection";
import HeroSlider from "@/component/home/HeroSlider";
import Footer from "@/component/layout/Footer";
import HeroAbout from "@/component/home/HeroAbout";
import PhoneDetail from "@/component/home/PhoneDetail";
import ProductCard from "@/component/ui/ProductCard";
import Testimonials from "@/component/home/Testimonial";
import FAQSection from "@/component/home/FaqSection";
import ProductSlider from "@/component/home/ProductSlider";

export default function Home() {
  const products = [
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
    <div>
      <Navbar/>
      <HeroSlider />
      <PhoneDetail/>
      <ProductSlider products={products} />
    <Testimonials/>
    <FAQSection/>
      <HeroAbout/>
      <Footer/>
    </div>
  );
}
