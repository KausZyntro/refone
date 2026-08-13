import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ReduxProvider from "@/redux/ReduxProvider";
import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

import { Suspense } from "react";
import { Outfit } from "next/font/google";

const outfit = Outfit({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Buy Refurbished iPhones India | Upto 75% Off | Shop Refone",
  metadataBase: new URL("https://refone.co.in"),
  keywords: [
    "buy refurbished iPhone India",
    "certified refurbished iPhone India",
    "refurbished iPhone with warranty India",
    "best refurbished iPhone store India",
  ],
  alternates: {
    canonical: "/",
  },
  description: " Refone sells only SUPER grade certified refurbished iPhones in India. 52-point tested, 90%+ battery, 12-month warranty, 7-day returns. Trusted by 1000+ buyers. Shop now.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={outfit.className}>
        <ReduxProvider>
          <Suspense fallback={null}>
            <Navbar />
          </Suspense>
          {children}
          <Footer />
          <ToastContainer position="top-right" autoClose={3000} />
        </ReduxProvider>
      </body>
    </html>
  );
}
