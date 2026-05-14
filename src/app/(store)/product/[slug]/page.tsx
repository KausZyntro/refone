import React from "react";
import "./productDetail.css";
import ProductPageClient from "@/components/product/ProductPageClient";
import ProductDetailTestPage from "@/components/productDetailtest/ProductDetailTestPage";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return {
    alternates: {
      canonical: `/product/${slug}`,
    },
  };
}

// Next.js App Router — server component.
// `params.slug` is the product_id (e.g. /product/2  → slug = "2")
const Page = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;
  return <ProductDetailTestPage productId={slug} />;
};

export default Page;