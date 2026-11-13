import { Suspense } from "react";
import type { Metadata } from "next";
import HeroSlider from "@/components/home/HeroSlider";
import AppLink from "@/components/home/AppLink";
import PhoneDetail from "@/components/home/PhoneDetail";
import Testimonials from "@/components/home/Testimonial";
import FAQSection from "@/components/home/FaqSection";
import FeaturesBanner from "@/components/home/FeaturesBanner";
import HomePageSeoData from "@/components/HomePageSeoData/HomePageSeoData";
import HomeBlogSlider from "@/components/blog/HomeBlogSlider";
import HomeBlogSkeleton from "@/components/blog/HomeBlogSkeleton";
import ReelsSection from "@/components/home/ReelsSection";
import { blogService } from "@/services/blogService";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
};

// Non-critical, below-the-fold content. It is streamed in after the page shell
// so a slow WordPress response cannot delay the hero (or the page render).
async function RecentArticles() {
  const blogs = await blogService.getBlogs(4);
  return <HomeBlogSlider blogs={blogs} />;
}

export default function Home() {
  return (
    <div>
      <HeroSlider />
      <PhoneDetail />
      {/* <ProductSlider products={products} /> */}
      {/* <ProductSlider/> */}
      {/* <Testimonials /> */}
      {/* <FAQSection /> */}
      <ReelsSection />
      <FeaturesBanner />
      <Suspense fallback={<HomeBlogSkeleton />}>
        <RecentArticles />
      </Suspense>
      <Testimonials />
      <FAQSection />
      <AppLink />
      <HomePageSeoData />
      {/* <ExchangePopup /> */}
    </div>
  );
}
