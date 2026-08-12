import Image from "next/image";
import styles from "./page.module.css";
import { Metadata } from "next";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
};
import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/home/HeroSection";
import HeroSlider from "@/components/home/HeroSlider";
import Footer from "@/components/layout/Footer";
import AppLink from "@/components/home/AppLink";
import PhoneDetail from "@/components/home/PhoneDetail";
import Testimonials from "@/components/home/Testimonial";
import FAQSection from "@/components/home/FaqSection";
import FeaturesBanner from "@/components/home/FeaturesBanner";
import HomePageSeoData from "@/components/HomePageSeoData/HomePageSeoData";
import HomeBlogSlider from "@/components/blog/HomeBlogSlider";
import { blogService } from "@/services/blogService";
import ReelsSection from "@/components/home/ReelsSection";

export default async function Home() {
   const blogs = await blogService.getBlogs();
   console.log("this is blog detail", blogs.slice(0,4))
  return (
    <div>
      <HeroSlider />
      <PhoneDetail />
      {/* <ProductSlider products={products} /> */}
      {/* <ProductSlider/> */}
      {/* <Testimonials /> */}
      {/* <FAQSection /> */}
      <ReelsSection />
      <FeaturesBanner/>
      <HomeBlogSlider blogs={blogs.slice(0, 4)} />
      <Testimonials />
      <FAQSection /> 
      <AppLink />
      <HomePageSeoData />
      {/* <ExchangePopup /> */}
    </div>
  );
}
