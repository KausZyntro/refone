import Image from "next/image";
import styles from "./page.module.css";
import Navbar from "@/component/layout/Navbar";
import HeroSection from "@/component/home/HeroSection";

export default function Home() {
  return (
    <div>
      <Navbar/>
      <HeroSection/>
    </div>
  );
}
