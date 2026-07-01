import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refone Careers | Join India's Refurbished Tech Leader",
  description: " Build your career with Refone. Explore exciting opportunities, growth, innovation, and a dynamic workplace in the refurbished tech industry.",
  alternates: {
    canonical: "https://refone.co.in/careers",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
