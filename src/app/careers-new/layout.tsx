import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Careers | Refone",
  alternates: {
    canonical: "/careers-new",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
