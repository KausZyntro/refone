import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | Refone",
  description: "Refone sells only Super Quality certified refurbished iPhones — 52-point inspection, 90%+ battery, 12-month warranty. Trusted store based in Varanasi, India.",
  alternates: {
    canonical: "https://refone.co.in/about-us",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
