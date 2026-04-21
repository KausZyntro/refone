'use client';

import React, { useEffect } from 'react';
import styles from './allProduct.module.css';
import Sidebar from './components/Sidebar';
import ProductCard from './components/ProductCard';
import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/redux/store';
import { fetchFilters } from '@/redux/features/productSlice';
import { useProductFilters } from '@/hooks/useProductFilters';

export default function AllProductPage() {
    const dispatch = useDispatch<AppDispatch>();
    const { products, filters: availableFilters, isProductsLoading, pagination, error } = useSelector(
        (state: RootState) => state.product,
    );
    const [showMobileFilters, setShowMobileFilters] = React.useState(false);

    const { filters, handleFilterChange, handlePageChange, clearAllFilters } = useProductFilters();


    useEffect(() => {
        dispatch(fetchFilters());
    }, [dispatch]);

    // const renderSkeletons = () => (
    //     Array.from({ length: 8 }).map((_, i) => (
    //         <div key={i} className={`${styles.productCard} ${styles.skeleton}`} style={{ height: '350px' }}>
    //             <div className={styles.productImageWrapper} style={{ height: '220px', backgroundColor: '#eee' }}></div>
    //             <div style={{ height: '20px', backgroundColor: '#eee', marginBottom: '10px', width: '80%' }}></div>
    //             <div style={{ height: '15px', backgroundColor: '#eee', marginBottom: '10px', width: '60%' }}></div>
    //             <div style={{ height: '25px', backgroundColor: '#eee', marginTop: 'auto', width: '40%' }}></div>
    //         </div>
    //     ))
    // );

    const renderSidebarSkeleton = () => (
        <div className={styles.sidebar}>
            {[1, 2, 3, 4].map((section) => (
                <div key={section} style={{ marginBottom: "20px" }}>
                    <div className={styles.skeletonBox} style={{ height: 20, width: "60%", marginBottom: 10 }} />

                    {[1, 2, 3].map((item) => (
                        <div key={item} style={{ display: "flex", gap: 10, marginBottom: 8 }}>
                            <div className={styles.skeletonBox} style={{ height: 16, width: 16 }} />
                            <div className={styles.skeletonBox} style={{ height: 16, width: "70%" }} />
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );

    const renderHeaderSkeleton = () => (
        <div className={styles.contentHeader}>
            <div className={styles.titleArea}>
                <div className={styles.skeletonBox} style={{ height: 24, width: "150px", marginBottom: 8 }} />
                <div className={styles.skeletonBox} style={{ height: 16, width: "120px" }} />
            </div>

            <div className={styles.contentActions}>
                <div className={styles.skeletonBox} style={{ height: 36, width: "150px" }} />
            </div>
        </div>
    );

    const renderSkeletons = () => (
        Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className={`${styles.productCard} ${styles.skeleton}`}>

                <div className={styles.productImageWrapper}>
                    <div className={styles.skeletonBox} style={{ height: "100%", width: "100%" }} />
                </div>

                <div className={styles.productDetails}>
                    <div className={styles.skeletonBox} style={{ height: '20px', width: '80%' }} />
                    <div className={styles.skeletonBox} style={{ height: '15px', width: '60%' }} />
                    <div className={styles.skeletonBox} style={{ height: '25px', width: '40%', marginTop: 'auto' }} />
                </div>

            </div>
        ))
    );

    return (
        <div className={styles.pageContainer}>
            {/* Breadcrumbs */}
            <div className={styles.breadcrumbs}>
                <Link href="/">Home</Link>
                <span>&gt;</span>
                <span style={{ color: '#333' }}>Smartphones</span>
            </div>

            <div className={styles.mainLayout}>
                {/* Sidebar */}
                {isProductsLoading ? (
                    renderSidebarSkeleton()
                ) : (
                    availableFilters && Object.keys(availableFilters).length > 0 ? (
                        <Sidebar
                            availableFilters={availableFilters}
                            selectedFilters={filters}
                            onFilterChange={handleFilterChange}
                            onClearAll={clearAllFilters}
                        />
                    ) : (
                        <div style={{ padding: 20 }}>
                            Loading filters...
                        </div>
                    )
                )}
                {/* <Sidebar
                    availableFilters={availableFilters}
                    selectedFilters={filters}
                    onFilterChange={handleFilterChange}
                    onClearAll={clearAllFilters}
                /> */}

                {/* Main Content Area */}
                <div className={styles.contentArea}>
                    {/* Header Area */}
                    <div className={styles.contentHeader}>
                        <div className={styles.titleArea}>
                            <h1 className={styles.contentTitle}>Smartphones</h1>
                            <p className={styles.contentSubtitle}>
                                {pagination?.total ?? 0} products found
                            </p>
                        </div>

                        {/* <div className={styles.contentActions}>
                            <div className={styles.sortBy}>
                                <button
                                    className={styles.mobileFilterBtn}
                                    onClick={() => setShowMobileFilters(true)}
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                                    </svg>
                                    Filters
                                </button>
                                <span>Sort by:</span>
                                <select className={styles.sortBySelect} defaultValue="popularity">
                                    <option value="popularity">Popularity</option>
                                    <option value="price-low">Price: Low to High</option>
                                    <option value="price-high">Price: High to Low</option>
                                    <option value="newest">Newest Arrivals</option>
                                </select>
                            </div>
                        </div> */}
                    </div>

                    {/* Product Grid */}
                    <div className={styles.productGrid}>
                        {isProductsLoading ? (
                            renderSkeletons()
                        ) : products.length > 0 ? (
                            products.map((product: any) => (
                                <ProductCard key={product.id} product={product} />
                            ))
                        ) : (
                            <div className={styles.noProducts}>
                                <div className={styles.noProductsIcon}>🔍</div>
                                <h2>No products found</h2>
                                <p>We couldn't find any products matching your current filters.</p>
                                <button onClick={clearAllFilters} className={styles.addToCartBtn} style={{ width: 'auto', padding: '12px 30px' }}>
                                    Clear All Filters
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    {pagination && pagination.last_page > 1 && (
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '40px' }}>
                            {Array.from({ length: pagination.last_page }).map((_, i) => (
                                <button
                                    key={i + 1}
                                    onClick={() => handlePageChange(i + 1)}
                                    className={`${styles.viewToggleBtn} ${pagination.current_page === i + 1 ? styles.active : ''}`}
                                    style={{ width: '40px' }}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            {showMobileFilters && (
                <div
                    className={styles.mobileFilterOverlay}
                    onClick={() => setShowMobileFilters(false)} // overlay click = close
                >
                    <div
                        className={styles.mobileFilterDrawer}
                        onClick={(e) => e.stopPropagation()} // drawer click = close na ho
                    >
                        <div className={styles.mobileFilterHeader}>
                            <h3>Filters</h3>
                            <button onClick={() => setShowMobileFilters(false)}>✕</button>
                        </div>

                        <Sidebar
                            availableFilters={availableFilters}
                            selectedFilters={filters}
                            onFilterChange={handleFilterChange}
                            onClearAll={clearAllFilters}
                            onClose={() => setShowMobileFilters(false)}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
