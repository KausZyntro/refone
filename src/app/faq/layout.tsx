import { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ | Refone",
  alternates: {
    canonical: "/faq-new",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
