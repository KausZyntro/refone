import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ReduxProvider from "@/redux/ReduxProvider";
import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Refone",
  description: "",
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
