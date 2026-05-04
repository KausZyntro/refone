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
    const sortedProducts = React.useMemo(() => {
    return [...products].sort((a, b) => {
        const stockA = a.variants?.[0]?.inventory?.available_stock || 0;
        const stockB = b.variants?.[0]?.inventory?.available_stock || 0;


        if (stockA > 0 && stockB === 0) return -1;
        if (stockA === 0 && stockB > 0) return 1;

        return 0;
    });
}, [products]);
console.log(sortedProducts)

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
                                <span>Sort by:</span>
                                <select 
                                    className={styles.sortBySelect} 
                                    value={filters.sort || 'popularity'}
                                    onChange={(e) => handleFilterChange('sort', e.target.value)}
                                >
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
                            sortedProducts.map((product: any) => (
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
            {/* Sticky Bottom Bar for Mobile */}
            <div className={styles.stickyBottomBar}>
                <button className={styles.stickyBarBtn} onClick={() => setShowMobileFilters(true)}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="4" y1="21" x2="4" y2="14"></line>
                        <line x1="4" y1="10" x2="4" y2="3"></line>
                        <line x1="12" y1="21" x2="12" y2="12"></line>
                        <line x1="12" y1="8" x2="12" y2="3"></line>
                        <line x1="20" y1="21" x2="20" y2="16"></line>
                        <line x1="20" y1="12" x2="20" y2="3"></line>
                        <line x1="1" y1="14" x2="7" y2="14"></line>
                        <line x1="9" y1="8" x2="15" y2="8"></line>
                        <line x1="17" y1="16" x2="23" y2="16"></line>
                    </svg>
                    Filters
                </button>
            </div>

            {showMobileFilters && (
                <div
                    className={styles.mobileFilterOverlay}
                    onClick={() => setShowMobileFilters(false)}
                >
                    <div
                        className={styles.mobileFilterDrawer}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className={styles.mobileFilterHeader}>
                            <h3 style={{ fontSize: '18px', fontWeight: 600 }}>Filters</h3>
                            <button 
                                onClick={() => setShowMobileFilters(false)}
                                style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}
                            >
                                ✕
                            </button>
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
