import React from "react";
import "./productDetail.css";
import ProductPageClient from "@/components/product/ProductPageClient";
import ProductDetailTestPage from "@/components/productDetailtest/ProductDetailTestPage";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{  id: string, slug: string }> }): Promise<Metadata> {
  const { id, slug } = await params;
  return {
    alternates: {
      canonical: `/product/${id}/${slug}`,
    },
  };
}

// Next.js App Router — server component.
// `params.slug` is the product_id (e.g. /product/2  → slug = "2")
const Page = async ({ params }: { params: Promise<{ id: string; slug: string }> }) => {
  // const { slug } = await params;
  const { id } = await params;
   return <ProductDetailTestPage productId={id} />;
};

export default Page;