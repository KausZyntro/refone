import React from "react";
import ProductPageClient from "@/components/product/ProductPageClient";
import ProductDetailTestPage from "@/components/productDetailtest/ProductDetailTestPage";

const Page = ({ params }: { params: { slug: string } }) => {
  return <ProductDetailTestPage productId={params.slug} />;
};

export default Page;