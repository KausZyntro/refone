import { Metadata } from "next";

const SITE_URL = "https://refone.co.in";

export function generateSEO({
  title,
  description,
  path,
  image = "/images/og-image.jpg",
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
}): Metadata {
  return {
    title,
    description,

    alternates: {
      canonical: path,
    },

    openGraph: {
      title,
      description,
      url: `${SITE_URL}${path}`,
      images: [image],
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}