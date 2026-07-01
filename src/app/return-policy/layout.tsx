import { Metadata } from "next";

export const metadata: Metadata = {
  title: " Refone Replacement Policy | Easy Returns & Customer Support",
  description:" Read Refone replacement policy for certified refurbished iPhones. Learn about returns, refunds, eligibility, and customer protection.",
  alternates: {
    canonical: "https://refone.co.in/return-policy",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
