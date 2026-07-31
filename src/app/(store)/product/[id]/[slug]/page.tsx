import React from "react";
import "./productDetail.css";
import ProductPageClient from "@/components/product/ProductPageClient";
import ProductDetailTestPage from "@/components/productDetailtest/ProductDetailTestPage";
import { Metadata } from "next";
import { productAPI } from "@/services/api";

export async function generateMetadata({ params }: { params: Promise<{  id: string, slug: string }> }): Promise<Metadata> {
  const { id, slug } = await params;
  return {
    alternates: {
      canonical: `/product/${id}/${slug}`,
    },
    description: `Buy a certified refurbished ${slug} at the best price. 1-Year Warranty, quality tested, fast delivery & easy returns. Shop today from Refone.`
  };
}



async function getProduct(id: string) {
  const data = await productAPI.getProducts();
  // console.log(data);
const product = data?.data?.find(
    (item: any) => item?.id === Number(id)
  );

  // console.log("Selected Product:", product);

  return product;
}


// Next.js App Router — server component.
// `params.slug` is the product_id (e.g. /product/2  → slug = "2")
const Page = async ({ params }: { params: Promise<{ id: string; slug: string }> }) => {
  // const { slug } = await params;
  
  const { id } = await params;
  const product = await getProduct(id);
  // console.log("This is from list",product);

  const productSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: product?.name,
  description: product?.description,
  category: "Refurbished Smartphones",
  brand: {
    "@type": "Brand",
    name: product?.brand.name,
  },
  hasVariant: product?.variants?.map((variant: any) => ({
    "@type": "Product",
    sku: variant?.sku,
    color: variant?.color,
    additionalProperty: [
      {
        "@type": "PropertyValue",
        name: "Storage",
        value: variant?.storage,
      },
       {
      "@type": "PropertyValue",
      name: "Warranty",
      value: "12 Months"
    },
    {
      "@type": "PropertyValue",
      name: "Quality Check",
      value: "52-Point Tested"
    },
    {
      "@type": "PropertyValue",
      name: "Battery Health",
      value: "Minimum 85%"
    },
    {
      "@type": "PropertyValue",
      name: "Network",
      value: "5G"
    },
    {
      "@type": "PropertyValue",
      name: "Operating System",
      value: "iOS"
    }

    ],
    offers: {
      "@type": "Offer",
      price: variant?.pricing?.selling_price,
      priceCurrency: "INR",
      availability:
        variant?.inventory?.total_stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
    },
    seller: {
      "@type": "Organization",
      name: "Refone",
      url: "https://refone.co.in"
    },


  })),
};
   return <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productSchema),
        }}
      />

      <ProductDetailTestPage productId={id} />
    </>
    ;
};

export default Page;