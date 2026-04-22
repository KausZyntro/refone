import Image from "next/image";
import styles from "./page.module.css";
import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/home/HeroSection";
import HeroSlider from "@/components/home/HeroSlider";
import Footer from "@/components/layout/Footer";
import HeroAbout from "@/components/home/HeroAbout";
import PhoneDetail from "@/components/home/PhoneDetail";
import ProductCard from "@/components/ui/ProductCard";
import Testimonials from "@/components/home/Testimonial";
import FAQSection from "@/components/home/FaqSection";
import ProductSlider from "@/components/home/ProductSlider";
import ExchangePopup from "@/components/common/ExchangeForm/ExchangePopup";

export default function Home() {
  return (
    <div>
      <HeroSlider />
      <PhoneDetail />
      {/* <ProductSlider products={products} /> */}
      {/* <ProductSlider/> */}
      {/* <Testimonials /> */}
      {/* <FAQSection /> */}
      <HeroAbout />
      <ExchangePopup />
    </div>
  );
}
