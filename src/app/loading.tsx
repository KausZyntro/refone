import React from "react";
import "@/styles/HeroSlider.css";
import "@/styles/PhoneDetail.css";
import "@/styles/ReelsSection.css";
import "@/styles/FeaturesBanner.css";
import blogStyles from "@/components/blog/HomeBlogSlider.module.css";
import "@/styles/Testimonial.css";
import "@/styles/FAQSection.css";
import "@/styles/AppLink.css";
import "@/styles/SkeletonLoader.css";

const Loading = () => {
  return (
    <div className="home-skeletor">
      {/* Hero Skeleton (banner) */}
      <div className="container-hero">
        <div className="home-skeletor-shimmer"></div>
      </div>

      {/* Category Section Skeleton (PhoneDetail) */}
      <section className="category-section" style={{ marginTop: '50px' }}>
        <div className="category-header">
          <div className="home-category-skeletor-shimmer"></div>
          <div className="home-cat-mob-skeletor-shimmer"></div>
        </div>
        
        {/* <div className="category-slider-container">
          <div className="category-swiper-placeholder">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="category-item category-item-placeholder">
                <div className="category-icon-wrapper"></div>
                <div className="home-skeletor-shimmer"></div>
              </div>
            ))}
          </div>
        </div> */}
      </section>

      {/* Reels Section Skeleton */}
      <section className="reels-section">
        <div className="container">
          <div className="reels-header">
            <div className="reels-header-left">
              <div className="home-skeletor-shimmer" style={{ width: '32px', height: '32px', borderRadius: '50%' }}></div>
              <div>
                <div className="home-skeletor-shimmer" style={{ width: '150px', height: '24px', borderRadius: '4px', marginBottom: '8px' }}></div>
                <div className="home-skeletor-shimmer" style={{ width: '250px', height: '16px', borderRadius: '4px' }}></div>
              </div>
            </div>
            <div className="home-skeletor-shimmer" style={{ width: '100px', height: '24px', borderRadius: '4px', alignSelf: 'center' }}></div>
          </div>
          <div style={{ display: 'flex', gap: '14px', overflow: 'hidden', padding: '10px 0' }}>
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="reel-card home-skeletor-shimmer" style={{ flexShrink: 0, width: '220px', height: '380px', borderRadius: '16px' }}></div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Banner Skeleton */}
      <div className="container feature-section-row" style={{ marginTop: '0', marginBottom: '32px' }}>
        <div className="features-banner-wrapper">
          {[1, 2, 3, 4].map((i) => (
             <div key={i} className="feature-item">
               <div className="home-skeletor-shimmer" style={{ width: '48px', height: '48px', borderRadius: '50%' }}></div>
               <div className="feature-text">
                 <div className="home-skeletor-shimmer" style={{ width: '120px', height: '20px', borderRadius: '4px', marginBottom: '8px' }}></div>
                 <div className="home-skeletor-shimmer" style={{ width: '180px', height: '14px', borderRadius: '4px' }}></div>
               </div>
             </div>
          ))}
        </div>
      </div>

      {/* Home Blog Slider Skeleton */}
      <section className={blogStyles.section}>
        <div className={blogStyles.container}>
          <div className={blogStyles.header}>
            <div className="home-skeletor-shimmer" style={{ width: '200px', height: '32px', borderRadius: '4px' }}></div>
            <div className="home-skeletor-shimmer" style={{ width: '120px', height: '24px', borderRadius: '4px' }}></div>
          </div>
          <div style={{ display: 'flex', gap: '24px', overflow: 'hidden' }}>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className={blogStyles.card} style={{ flex: '1', minWidth: '280px' }}>
                <div className="home-skeletor-shimmer" style={{ width: '100%', height: '200px', borderTopLeftRadius: '12px', borderTopRightRadius: '12px' }}></div>
                <div className={blogStyles.content}>
                  <div className="home-skeletor-shimmer" style={{ width: '80px', height: '24px', borderRadius: '20px', marginBottom: '12px' }}></div>
                  <div className="home-skeletor-shimmer" style={{ width: '100%', height: '24px', borderRadius: '4px', marginBottom: '8px' }}></div>
                  <div className="home-skeletor-shimmer" style={{ width: '80%', height: '24px', borderRadius: '4px', marginBottom: '16px' }}></div>
                  <div className="home-skeletor-shimmer" style={{ width: '150px', height: '16px', borderRadius: '4px' }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Skeleton */}
      <div className="testimonial-section">
        <div className="testimonial-header" style={{ justifyContent: 'center' }}>
           <div className="home-skeletor-shimmer" style={{ width: '250px', height: '32px', borderRadius: '4px' }}></div>
        </div>
        <div style={{ display: 'flex', gap: '20px', overflow: 'hidden', padding: '20px' }}>
           {[1, 2, 3, 4].map((i) => (
              <div key={i} className="testimonial-card" style={{ flex: '1', minWidth: '280px' }}>
                 <div className="user-info">
                    <div className="home-skeletor-shimmer" style={{ width: '50px', height: '50px', borderRadius: '50%' }}></div>
                    <div className="home-skeletor-shimmer" style={{ width: '120px', height: '20px', borderRadius: '4px', marginLeft: '12px' }}></div>
                 </div>
                 <div className="home-skeletor-shimmer" style={{ width: '100%', height: '14px', borderRadius: '4px', marginTop: '16px' }}></div>
                 <div className="home-skeletor-shimmer" style={{ width: '90%', height: '14px', borderRadius: '4px', marginTop: '8px' }}></div>
                 <div className="home-skeletor-shimmer" style={{ width: '80%', height: '14px', borderRadius: '4px', marginTop: '8px' }}></div>
              </div>
           ))}
        </div>
      </div>

      {/* FAQ Section Skeleton */}
      <section className="faq-section">
        <div className="faq-container">
          <div className="faq-header" style={{ justifyContent: 'center', marginBottom: '30px' }}>
            <div className="home-skeletor-shimmer" style={{ width: '300px', height: '32px', borderRadius: '4px' }}></div>
          </div>
          <div className="faq-content-wrapper">
             <div className="faq-list-grid">
               {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="faq-item" style={{ display: 'flex', alignItems: 'center', padding: '20px' }}>
                     <div className="home-skeletor-shimmer" style={{ width: '80%', height: '24px', borderRadius: '4px' }}></div>
                  </div>
               ))}
             </div>
             <div className="faq-image-container">
                <div className="home-skeletor-shimmer" style={{ width: '100%', height: '400px', borderRadius: '16px' }}></div>
             </div>
          </div>
        </div>
      </section>

      {/* AppLink Skeleton */}
      <section className="applink-section" style={{ padding: '20px' }}>
        <div className="applink-container" style={{ margin: '0 auto', maxWidth: '1250px' }}>
           <div className="home-skeletor-shimmer" style={{ width: '100%', aspectRatio: '1360/480', borderRadius: '16px', minHeight: '200px' }}></div>
        </div>
      </section>
    </div>
  );
};

export default Loading;
