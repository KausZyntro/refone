"use client"
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { productAPI } from "@/services/api";
import { slugify } from "@/utils/slug";
import "@/styles/PhoneDetail.css";

const FALLBACK_IMG = "/placeholder.png";
const CATEGORY_LIMIT = 8;

type Category = {
  id: number | string;
  name: string;
  slug: string;
  variant: number | string;
  img: string;
};

const PhoneDetailSlider = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isActive = true;

    const loadCategories = async () => {
      try {
        const response = await productAPI.getProducts(`limit=${CATEGORY_LIMIT}`);
        // The API structure is { status, code, data: { data: [...] } }
        const items = response?.data?.data ?? response?.data ?? [];

        if (!isActive) return;

        setCategories(
          (Array.isArray(items) ? items : []).map((product: any) => {
            const variants = product.variants ?? [];
            const variant =
              variants.find((v: any) => (v.inventory?.available_stock ?? 0) > 0) ||
              variants[0];

            return {
              id: product.id,
              name: product.name,
              slug: slugify(product.seo_meta?.slug || product.name || ""),
              variant: variant?.id || "",
              img: variant?.images?.[0]?.image_url || FALLBACK_IMG,
            };
          }),
        );
      } catch (error) {
        console.error("Error fetching category products:", error);
        if (isActive) setCategories([]);
      } finally {
        if (isActive) setIsLoading(false);
      }
    };

    loadCategories();

    return () => {
      isActive = false;
    };
  }, []);

  if (!isLoading && categories.length === 0) {
    return null;
  }

  return (
    <section className="category-section">
      <div className="category-header">
        <h2>Shop By Category</h2>
        <a href="/allProduct" className="view-all-link">View All &nbsp;›</a>
      </div>

      <div className="category-slider-container">
        {isLoading ? (
          <div className="category-swiper-placeholder">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="category-item-placeholder">
                <div
                  className="category-icon-wrapper"
                  style={{ background: "#f3f4f6", width: "100%" }}
                />
                <div
                  className="category-name"
                  style={{ background: "#f3f4f6", borderRadius: 6, height: 14 }}
                />
              </div>
            ))}
          </div>
        ) : (
          <>
            <Swiper
              modules={[Navigation, Autoplay]}
              navigation={{
                nextEl: ".category-swiper-button-next",
                prevEl: ".category-swiper-button-prev",
              }}
              autoplay={{
                delay: 4000,
                disableOnInteraction: true,
                pauseOnMouseEnter: true,
              }}
              spaceBetween={24}
              slidesPerView={6}
              breakpoints={{
                320: {
                  slidesPerView: 2.2,
                  spaceBetween: 12,
                },
                480: {
                  slidesPerView: 3.2,
                  spaceBetween: 16,
                },
                768: {
                  slidesPerView: 4.2,
                  spaceBetween: 20,
                },
                1024: {
                  slidesPerView: 5.2,
                  spaceBetween: 24,
                },
                1200: {
                  slidesPerView: 6,
                  spaceBetween: 24,
                },
              }}
              className="category-swiper"
            >
              {categories.map((cat, index) => (
                <SwiperSlide key={index}>
                  <a
                    href={`/products/${cat?.slug}?variant=${cat?.variant}`}
                    className="category-item"
                  >
                    <div className="category-icon-wrapper">
                      <Image src={cat.img} alt={cat.name} width={150} height={150} sizes="150px" />
                    </div>
                    <p className="category-name">{cat.name}</p>
                  </a>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Custom Navigation Arrows */}
            <button className="category-swiper-button-prev" aria-label="Previous slide">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>
            <button className="category-swiper-button-next" aria-label="Next slide">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </>
        )}
      </div>
    </section>
  );
};

export default PhoneDetailSlider;
