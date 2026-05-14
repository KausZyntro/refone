import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Return Policy | Refone",
  alternates: {
    canonical: "/return-policy",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
