import { Metadata } from "next";

export const metadata: Metadata = {
  title: " Contact Refone | Customer Support & Sales Assistance",
  description:" Get in touch with Refone for product inquiries, support, orders, warranty assistance, and refurbished iPhone recommendations.",
  alternates: {
    canonical: " https://refone.co.in/contact-us",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
