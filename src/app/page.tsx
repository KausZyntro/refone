import Image from "next/image";
import styles from "./page.module.css";
import Navbar from "@/component/layout/Navbar";
import HeroSection from "@/component/home/HeroSection";
import HeroSlider from "@/component/home/HeroSlider";
import Footer from "@/component/layout/Footer";
import HeroAbout from "@/component/home/HeroAbout";
import PhoneDetail from "@/component/home/PhoneDetail";

export default function Home() {
  return (
    <div>
      <Navbar/>
      <HeroSlider />
      <PhoneDetail/>
      <HeroAbout/>
      <Footer/>
    </div>
  );
}
