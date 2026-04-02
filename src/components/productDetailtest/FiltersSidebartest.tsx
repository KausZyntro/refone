"use client";

import React from "react";
import { FaChevronRight } from "react-icons/fa";
import styles from "./FiltersSidebartest.module.css";

const brands = ["Samsung", "Apple", "Google", "OnePlus", "Xiamoi"];
const filterSections = ["Price", "Screen Size", "RAM"];

const FiltersSidebartest: React.FC = () => {
    return (
        <aside className={styles.sidebar}>
            <div className={styles.filterTitle}>
                Filters <FaChevronRight />
            </div>

            <div className={styles.sectionTitle}>
                Brand <FaChevronRight />
            </div>
            <ul className={styles.brandList}>
                {brands.map((brand) => (
                    <li key={brand} className={styles.brandItem}>
                        <span className={styles.brandArrow}>▶</span> {brand}
                    </li>
                ))}
            </ul>

            {filterSections.map((section) => (
                <div key={section} className={styles.sectionTitle}>
                    {section} <FaChevronRight />
                </div>
            ))}
        </aside>
    );
};

export default FiltersSidebartest;
