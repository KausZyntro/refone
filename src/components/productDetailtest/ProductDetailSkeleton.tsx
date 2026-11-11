import React from "react";
import styles from "./ProductDetailSkeleton.module.css";

const ProductDetailSkeleton: React.FC = () => {
    return (
        <div
            className={styles.pageWrapper}
            aria-busy="true"
            aria-label="Loading product details"
        >
            {/* Breadcrumb */}
            <div className={styles.breadcrumb}>
                <span className={`${styles.block} ${styles.breadcrumbItem}`} />
                <span className={`${styles.block} ${styles.breadcrumbSep}`} />
                <span className={`${styles.block} ${styles.breadcrumbItem}`} />
                <span className={`${styles.block} ${styles.breadcrumbSep}`} />
                <span className={`${styles.block} ${styles.breadcrumbItemWide}`} />
            </div>

            {/* Gallery | Info | Sidebar */}
            <div className={styles.topSection}>
                <div className={styles.gallery}>
                    <div className={`${styles.block} ${styles.galleryImage}`} />
                    <div className={styles.thumbRow}>
                        {[0, 1, 2, 3].map((i) => (
                            <div key={i} className={`${styles.block} ${styles.thumb}`} />
                        ))}
                    </div>
                </div>

                <div className={styles.info}>
                    <div className={`${styles.block} ${styles.lineShort}`} />
                    <div className={`${styles.block} ${styles.lineTitle}`} />
                    <div className={`${styles.block} ${styles.lineMedium}`} />
                    <div className={`${styles.block} ${styles.lineWide}`} />
                    <div className={`${styles.block} ${styles.lineWide}`} />
                    <div className={`${styles.block} ${styles.lineMedium}`} />
                    <div className={styles.pillRow}>
                        {[0, 1, 2].map((i) => (
                            <div key={i} className={`${styles.block} ${styles.pill}`} />
                        ))}
                    </div>
                </div>

                <div className={styles.sidebar}>
                    <div className={`${styles.block} ${styles.lineShort}`} />
                    <div className={`${styles.block} ${styles.conditionCard}`} />
                    <div className={`${styles.block} ${styles.conditionCard}`} />
                    <div className={`${styles.block} ${styles.conditionCard}`} />
                    <div className={`${styles.block} ${styles.button}`} />
                    <div className={`${styles.block} ${styles.button}`} />
                </div>
            </div>

            {/* Key specifications */}
            <div className={styles.specsSection}>
                <div className={`${styles.block} ${styles.lineSectionTitle}`} />
                <div className={styles.specsGrid}>
                    {[0, 1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className={`${styles.block} ${styles.specCard}`} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProductDetailSkeleton;
