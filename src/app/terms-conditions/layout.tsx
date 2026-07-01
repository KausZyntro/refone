import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refone Terms & Conditions | Website & Purchase Policies",
  description:"Review Refone terms and conditions covering website usage, orders, payments, warranties, returns, and customer responsibilities.",
  alternates: {
    canonical: "https://refone.co.in/terms-conditions ",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
