"use client";
import React, { useEffect, useState } from "react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { FaCreditCard } from "react-icons/fa";

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
        <div key={campaign.campaign_id} className="best-sellers-section">
          <header className="category-header">
            <h2>Best Sellers</h2>
            <a href="/allProduct" className="view-all-blue">View All</a>
          </header>
          
          {!mobile ? (
            <Swiper
              modules={[Navigation]}
              spaceBetween={20}
              navigation
              className="refone-product-swiper"
              style={{ padding: '10px 0 20px 0' }}
              breakpoints={{
                1024: { slidesPerView: 2.2, spaceBetween: 20 },
                1280: { slidesPerView: 2.5, spaceBetween: 24 },
                1440: { slidesPerView: 3, spaceBetween: 30 },
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
          ) : (
            <div className="mobile-vertical-list">
              {campaign.products.slice(0, 4).map((product: any, index: number) => {
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
                  <div key={`${product.id}-${index}`} style={{ marginBottom: '15px' }}>
                    <RefoneProductCard product={formattedProduct} />
                  </div>
                );
              })}
            </div>
          )}

          <div className="emi-banner" style={{ marginTop: '30px', background: '#f0f7ff', padding: '20px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #e3f2fd' }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{ background: '#006aaf', padding: '10px', borderRadius: '50%', color: 'white' }}>
                  <FaCreditCard size={20} />
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '700' }}>No Cost EMI Available</h4>
                  <p style={{ margin: 0, fontSize: '13px', color: '#666' }}>On all major credit cards and selected debit cards.</p>
                </div>
             </div>
             <a href="/allProduct" style={{ color: '#006aaf', fontWeight: '700', fontSize: '14px' }}>Check Offers ›</a>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductSlider;
