"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

import ProductCard from "@/components/ui/ProductCard";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchDashboardCampaigns } from "@/redux/features/dashboardCampaign";
import { AppDispatch, RootState } from "@/redux/store";

// const ProductSlider = ({ products }) => {
const ProductSlider = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { products, campaigns, isLoading } = useSelector(
    (state: RootState) => state.campaign,
  );
  useEffect(() => {
    dispatch(fetchDashboardCampaigns());
  }, [dispatch]);

  useEffect(() => {
    console.log("Campaigns 👉", campaigns);
    // console.log("products 👉", products); 
  }, [campaigns, products]);
  return (
    // <div className="container">
    //   <header className="product-card-header">
    //     <h1>Trending</h1>
    //     {/* <h1>{campaigns.length}</h1> */}
    //   </header>
    //   <Swiper
    //     modules={[Navigation]}
    //     spaceBetween={20}
    //     navigation
    //     breakpoints={{
    //       320: { slidesPerView: 1.1, spaceBetween: 12 },
    //       480: { slidesPerView: 2, spaceBetween: 15 },
    //       768: { slidesPerView: 2.5, spaceBetween: 20 },
    //       1024: { slidesPerView: 3.5, spaceBetween: 25 },
    //       1280: { slidesPerView: 4, spaceBetween: 30 },
    //       1440: { slidesPerView: 4.5, spaceBetween: 30 },
    //     }}
    //   >
    //     {products.map((product) => (
    //       <SwiperSlide key={product.id}>
    //         <ProductCard product={product} />
    //       </SwiperSlide>
    //     ))}
    //   </Swiper>
    // </div>

    <div className="container">
      {campaigns.map((campaign: any) => (
        <div key={campaign.campaign_id}>
          <header className="product-card-header">
            <h2>{campaign.campaign_name}</h2>
          </header>
          <Swiper
            modules={[Navigation]}
            spaceBetween={20}
            navigation
            breakpoints={{
              320: { slidesPerView: 1.1, spaceBetween: 12 },
              480: { slidesPerView: 2, spaceBetween: 15 },
              768: { slidesPerView: 2.5, spaceBetween: 20 },
              1024: { slidesPerView: 3.5, spaceBetween: 25 },
              1280: { slidesPerView: 4, spaceBetween: 30 },
              1440: { slidesPerView: 4.5, spaceBetween: 30 },
            }}
          >
            {campaign.products.map((product: any, index: number) => {
              // Flatten nested variant/pricing/image — raw API doesn't have flat price/image
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
              };

              return (
                <SwiperSlide
                  key={`${campaign.campaign_id}-${product.id}-${index}`}
                >
                  <ProductCard product={formattedProduct} />
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      ))}
    </div>
  );
};

export default ProductSlider;
