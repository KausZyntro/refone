import React from "react";
import "./productDetail.css";
import ProductPageClient from "@/components/product/ProductPageClient";

// Next.js App Router — server component.
// `params.slug` is the product_id (e.g. /product/2  → slug = "2")
const Page = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;
  return <ProductPageClient productId={slug} />;
};

export default Page;