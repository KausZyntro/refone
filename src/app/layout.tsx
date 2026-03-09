import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ReduxProvider from "@/redux/ReduxProvider";


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
        <Navbar/>
        {children}
        <Footer/>
        </ReduxProvider>
      </body>
    </html>
  );
}
