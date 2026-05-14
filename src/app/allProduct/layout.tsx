import { Metadata } from "next";

export const metadata: Metadata = {
  alternates: {
    canonical: "/allProduct",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
