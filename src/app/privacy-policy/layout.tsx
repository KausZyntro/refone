import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Refone",
  alternates: {
    canonical: "/privacy-policy",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
