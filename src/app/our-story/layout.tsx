import { Metadata } from "next";

export const metadata: Metadata = {
  title: " Refone Our Story | India's Trusted Refurbished iPhone Brand",
  description: " Discover the Refone journey. Learn how Refone became a trusted destination for certified refurbished iPhones with quality checks and warranty.",
  alternates: {
    canonical: "https://refone.co.in/our-story",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
