import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | Refone",
  description: "Learn more about Refone, our mission, and our premium refurbished iPhones.",
  alternates: {
    canonical: "/about-us-new",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
