import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ReduxProvider from "@/redux/ReduxProvider";
import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

import { Suspense } from "react";

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
    canonical: "https://refone.co.in/",
  },
  description: "Get refurbished iPhones at up to 75% off—72-point tested, 90%+ battery, 12-month warranty. Limited stock. Shop Refone now!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ReduxProvider>
          {/* <Suspense fallback={null}> */}
            <Navbar />
          {/* </Suspense> */}
          {children}
          <Footer />
          <ToastContainer position="top-right" autoClose={3000} />
        </ReduxProvider>
      </body>
    </html>
  );
}
