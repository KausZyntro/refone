import React from 'react';
import styles from '../allProduct.module.css';

interface SidebarProps {
    filters: {
        brands: string[];
        prices: string[];
        screenSizes: string[];
        ram: string[];
    };
}

const Sidebar: React.FC<SidebarProps> = ({ filters }) => {
    return (
        <aside className={styles.sidebar}>
            <div className={styles.filterGroup}>
                <div className={styles.filterHeader}>Filters <span>&gt;</span></div>
            </div>

            <div className={styles.filterGroup}>
                <div className={styles.filterHeader}>Brand</div>
                <ul className={styles.filterList}>
                    {filters.brands.map((brand, idx) => (
                        <li key={idx} className={styles.filterItem}>
                            <span>&#8227;</span> {brand}
                        </li>
                    ))}
                </ul>
            </div>

            <div className={styles.filterGroup}>
                <div className={styles.filterHeader}>Price <span>&gt;</span></div>
            </div>

            <div className={styles.filterGroup}>
                <div className={styles.filterHeader}>Screen Size <span>&gt;</span></div>
            </div>

            <div className={styles.filterGroup}>
                <div className={styles.filterHeader}>RAM <span>&gt;</span></div>
            </div>
        </aside>
    );
};

export default Sidebar;
