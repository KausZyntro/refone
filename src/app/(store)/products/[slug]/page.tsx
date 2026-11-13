import React, { cache } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductDetailTestPage from "@/components/productDetailtest/ProductDetailTestPage";
import { fetchProductBySlugServer } from "@/services/api";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  const name = product?.name ?? slug.replace(/-/g, " ");

  return {
    alternates: {
      canonical: `/products/${slug}`,
    },
    description: `Buy a certified refurbished ${name} at the best price. 1-Year Warranty, quality tested, fast delivery & easy returns. Shop today from Refone.`,
  };
}

// Cached per request: the product is fetched once on the server and handed to
// the client tree, so it never has to be re-fetched after hydration.
const getProduct = cache((slug: string) => fetchProductBySlugServer(slug));

// Short product URLs: /products/iphone-15-pro?variant=77
const Page = async ({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ variant?: string | string[] }>;
}) => {
  const { slug } = await params;
  const { variant } = await searchParams;

  const product = await getProduct(slug);
  if (!product) notFound();

  const variantParam = Array.isArray(variant) ? variant[0] : variant;
  const initialVariantId = variantParam ? Number(variantParam) : undefined;

  return (
    <ProductDetailTestPage
      productId={String(product.id)}
      initialProduct={product}
      initialVariantId={
        initialVariantId != null && !Number.isNaN(initialVariantId) ? initialVariantId : undefined
      }
    />
  );
};

export default Page;
