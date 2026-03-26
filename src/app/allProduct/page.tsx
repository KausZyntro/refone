'use client';

import React from 'react';
import styles from './allProduct.module.css';
import { products, filterOptions } from './dummyData';
import Sidebar from './components/Sidebar';
import ProductCard from './components/ProductCard';
import Link from 'next/link';

export default function AllProductPage() {
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
                <Sidebar filters={filterOptions} />

                {/* Main Content Area */}
                <div className={styles.contentArea}>
                    {/* Header Area containing Title and Actions */}
                    <div className={styles.contentHeader}>
                        <div className={styles.titleArea}>
                            <h1 className={styles.contentTitle}>Smartphones</h1>
                            <p className={styles.contentSubtitle}>Browse our latest smartphone collection.</p>
                        </div>

                        <div className={styles.contentActions}>
                            <div className={styles.sortBy}>
                                <span>Sort by:</span>
                                <select className={styles.sortBySelect} defaultValue="popularity">
                                    <option value="popularity">Popularity</option>
                                    <option value="price-low">Price: Low to High</option>
                                    <option value="price-high">Price: High to Low</option>
                                    <option value="newest">Newest Arrivals</option>
                                </select>
                            </div>
                            <div className={styles.viewToggles}>
                                <button className={`${styles.viewToggleBtn} ${styles.active}`} aria-label="Grid view">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M4 4h6v6H4zm10 0h6v6h-6zM4 14h6v6H4zm10 0h6v6h-6z" />
                                    </svg>
                                </button>
                                <button className={styles.viewToggleBtn} aria-label="List view">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Product Grid */}
                    <div className={styles.productGrid}>
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
