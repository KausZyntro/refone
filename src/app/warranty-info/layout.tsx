import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refone Warranty Info | Certified iPhone Protection India",
  description:"Learn about Refone warranty coverage, claims, repairs, and support for certified refurbished iPhones. Buy with confidence from Refone.",
  alternates: {
    canonical: "https://refone.co.in/warranty-info",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
