import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refone Blog | Refurbished iPhone Tips, Guides & Reviews",
  description:" Explore Refone Blog for refurbished iPhone buying guides, tech tips, comparisons, reviews, and expert insights to make smarter purchases.",
  alternates: {
    canonical: " https://refone.co.in/blog",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
