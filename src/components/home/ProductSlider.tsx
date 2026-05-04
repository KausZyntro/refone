"use client";
import React, { useEffect, useState } from "react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

import RefoneProductCard from "@/components/ui/RefoneProductCard";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboardCampaigns } from "@/redux/features/dashboardCampaign";
import { AppDispatch, RootState } from "@/redux/store";

// const ProductSlider = ({ products }) => {
const ProductSlider = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    setMobile(window.innerWidth < 768);
    const handleResize = () => setMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const { products, campaigns, isLoading } = useSelector(
    (state: RootState) => state.campaign,
  );
  useEffect(() => {
    dispatch(fetchDashboardCampaigns());
  }, [dispatch]);

  return (
    <div className="container" style={{ marginTop: '32px' }}>
      {campaigns
        .filter((c: any) => c.campaign_name === "Apple Fest 2025")
        .map((campaign: any) => (
        <div key={campaign.campaign_id}>
          <header className="product-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '700' }}>{campaign.campaign_name}</h2>
            <a href="/allProduct" style={{ color: '#006aaf', fontWeight: 600, fontSize: '14px' }}>View All</a>
          </header>
          
          {mobile ? (
            <div className="mobile-product-list" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {campaign.products.map((product: any, index: number) => {
                const variant = product.variants?.[0];
                const formattedProduct = {
                  id: product.id,
                  name: product.name,
                  brand: product.brand?.name,
                  slug: product.slug,
                  rating: product.rating,
                  price: variant?.pricing?.selling_price,
                  mrp: variant?.pricing?.mrp,
                  image: variant?.images?.[0]?.image_url,
                  storage: variant?.attributes?.storage,
                  color: variant?.attributes?.color,
                  condition: product.condition || "Excellent",
                  total_stock: variant?.inventory?.total_stock,
                  inbound_stock: variant?.inventory?.inbound_stock,
                  is_active: variant?.inventory?.is_active,
                };
                return <RefoneProductCard key={`${product.id}-${index}`} product={formattedProduct} />;
              })}
            </div>
          ) : (
            <Swiper
              modules={[Navigation]}
              spaceBetween={20}
              navigation
              className="refone-product-swiper"
              style={{ padding: '10px 0 20px 0' }}
              breakpoints={{
                768: { slidesPerView: 1.8, spaceBetween: 20 },
                1024: { slidesPerView: 3.2, spaceBetween: 25 },
                1280: { slidesPerView: 4, spaceBetween: 30 },
              }}
            >
              {campaign.products.map((product: any, index: number) => {
                const variant = product.variants?.[0];
                const formattedProduct = {
                  id: product.id,
                  name: product.name,
                  brand: product.brand?.name,
                  slug: product.slug,
                  rating: product.rating,
                  price: variant?.pricing?.selling_price,
                  mrp: variant?.pricing?.mrp,
                  image: variant?.images?.[0]?.image_url,
                  storage: variant?.attributes?.storage,
                  color: variant?.attributes?.color,
                  condition: product.condition || "Excellent",
                  total_stock: variant?.inventory?.total_stock,
                  inbound_stock: variant?.inventory?.inbound_stock,
                  is_active: variant?.inventory?.is_active,
                };

                return (
                  <SwiperSlide key={`${campaign.campaign_id}-${product.id}-${index}`}>
                    <RefoneProductCard product={formattedProduct} />
                  </SwiperSlide>
                );
              })}
            </Swiper>
          )}
        </div>
      ))}
    </div>
  );
};

export default ProductSlider;
