import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ page_key: string }> }): Promise<Metadata> {
  const { page_key } = await params;
  return {
    alternates: {
      canonical: `/${page_key}`,
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
