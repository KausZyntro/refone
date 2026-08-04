'use client';

import React, { useState, useEffect } from 'react';
import styles from '../allProduct.module.css';
import { FilterState } from '@/hooks/useProductFilters';

interface SidebarProps {
    availableFilters: any;
    selectedFilters: FilterState;
    onFilterChange: (key: keyof FilterState, value: any) => void;
    onClearAll: () => void;
    onClose?: () => void;
}

const MIN_PRICE = 20000;
const MAX_PRICE = 200000;

const Sidebar: React.FC<SidebarProps> = ({
    availableFilters,
    selectedFilters,
    onFilterChange,
    onClearAll,
    onClose
}) => {
    if (!availableFilters) return null;

    const [minVal, setMinVal] = useState<number>(selectedFilters.min_price ?? MIN_PRICE);
    const [maxVal, setMaxVal] = useState<number>(selectedFilters.max_price ?? MAX_PRICE);

    // Sync local state if external filter changes (e.g. clear all)
    useEffect(() => {
        setMinVal(selectedFilters.min_price ?? MIN_PRICE);
        setMaxVal(selectedFilters.max_price ?? MAX_PRICE);
    }, [selectedFilters.min_price, selectedFilters.max_price]);

    const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Math.min(Number(e.target.value), maxVal - 1000);
        setMinVal(value);
        onFilterChange('min_price', value === MIN_PRICE ? null : value);
    };

    const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Math.max(Number(e.target.value), minVal + 1000);
        setMaxVal(value);
        onFilterChange('max_price', value === MAX_PRICE ? null : value);
    };

    const minPercent = ((minVal - MIN_PRICE) / (MAX_PRICE - MIN_PRICE)) * 100;
    const maxPercent = ((maxVal - MIN_PRICE) / (MAX_PRICE - MIN_PRICE)) * 100;

    const formatPrice = (price: number) =>
        '₹' + price.toLocaleString('en-IN');

    const handleMultiSelect = (key: keyof FilterState, value: any) => {
        const current = selectedFilters[key] as any[];
        if (current.includes(value)) {
            onFilterChange(key, current.filter(item => item !== value));
        } else {
            onFilterChange(key, [...current, value]);
        }
        if (onClose) onClose();
    };

    const handleSingleSelect = (key: keyof FilterState, value: any) => {
        onFilterChange(key, value);
        if (onClose) onClose();
    };

    return (
        <aside className={styles.sidebar}>
            <div className={styles.filterGroup}>
                <div className={styles.filterHeader}>
                    Filters
                    <button onClick={onClearAll} className={styles.clearLink} style={{ fontSize: '12px', color: '#006ab0', background: 'none', border: 'none', cursor: 'pointer' }}>
                        Clear All
                    </button>
                </div>
            </div>

            {/* Brand - COMMENTED OUT */}
            {/* {availableFilters.brands && (
                <div className={styles.filterGroup}>
                    <div className={styles.filterHeader}>Brand</div>
                    <ul className={styles.filterList}>
                        {availableFilters.brands.map((brand: any) => (
                            <li key={brand.id} className={styles.filterItem} onClick={() => handleSingleSelect('brand_id', selectedFilters.brand_id === brand.id ? null : brand.id)}>
                                <input type="radio" checked={selectedFilters.brand_id === brand.id} readOnly />
                                {brand.name}
                            </li>
                        ))}
                    </ul>
                </div>
            )} */}

            {/* Campaign - COMMENTED OUT */}
            {/* {availableFilters.campaign && (
                <div className={styles.filterGroup}>
                    <div className={styles.filterHeader}>Campaign</div>
                    <ul className={styles.filterList}>
                        {availableFilters.campaign.map((campaign: any) => (
                            <li key={campaign.id} className={styles.filterItem} onClick={() => handleSingleSelect('campaign_id', selectedFilters.campaign_id === campaign.id ? null : campaign.id)}>
                                <input type="radio" checked={selectedFilters.campaign_id === campaign.id} readOnly />
                                {campaign.name}
                            </li>
                        ))}
                    </ul>
                </div>
            )} */}

            {/* Price Range - Dual Slider */}
            <div className={styles.filterGroup}>
                <div className={styles.filterHeader}>Price Range</div>
                <div className={styles.priceSliderWrapper}>
                    <div className={styles.priceSliderLabels}>
                        <span>{formatPrice(minVal)}</span>
                        <span>{formatPrice(maxVal)}</span>
                    </div>
                    <div className={styles.priceSliderTrack}>
                        <div
                            className={styles.priceSliderFill}
                            style={{ left: `${minPercent}%`, width: `${maxPercent - minPercent}%` }}
                        />
                        <input
                            type="range"
                            min={MIN_PRICE}
                            max={MAX_PRICE}
                            step={1000}
                            value={minVal}
                            onChange={handleMinChange}
                            className={`${styles.priceSliderInput} ${styles.priceSliderInputMin}`}
                        />
                        <input
                            type="range"
                            min={MIN_PRICE}
                            max={MAX_PRICE}
                            step={1000}
                            value={maxVal}
                            onChange={handleMaxChange}
                            className={`${styles.priceSliderInput} ${styles.priceSliderInputMax}`}
                        />
                    </div>
                </div>
            </div>

            {/* Availability - COMMENTED OUT */}
            {/* {availableFilters.availability && (
                <div className={styles.filterGroup}>
                    <div className={styles.filterHeader}>Availability</div>
                    <ul className={styles.filterList}>
                        {availableFilters.availability.map((avail: any) => (
                            <li key={avail.key} className={styles.filterItem} onClick={() => handleSingleSelect('in_stock', selectedFilters.in_stock === (avail.key === 'in_stock') ? null : (avail.key === 'in_stock'))}>
                                <input type="checkbox" checked={avail.key === 'in_stock' ? !!selectedFilters.in_stock : selectedFilters.in_stock === false} readOnly />
                                {avail.label} ({avail.count})
                            </li>
                        ))}
                    </ul>
                </div>
            )} */}

            {/* Storage - Multi Select */}
            {availableFilters.storage && (
                <div className={styles.filterGroup}>
                    <div className={styles.filterHeader}>Storage</div>
                    <ul className={styles.filterList}>
                        {availableFilters.storage.map((storage: string) => (
                            <li key={storage} className={styles.filterItem} onClick={() => handleMultiSelect('storage', storage)}>
                                <input
                                    type="checkbox"
                                    checked={(selectedFilters.storage as any[]).includes(storage)}
                                    readOnly
                                />
                                {storage}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Colors - Swatches */}
            {availableFilters.colors && (
                <div className={styles.filterGroup}>
                    <div className={styles.filterHeader}>Colors</div>
                    <div className={styles.colorGrid}>
                        {availableFilters.colors.map((color: any) => (
                            <div
                                key={color.color}
                                className={styles.colorSwatchWrapper}
                                onClick={() => handleSingleSelect('color', color.color)}
                                title={color.color}
                            >
                                <div
                                    className={`${styles.colorSwatch} ${selectedFilters.color.includes(color.color) ? styles.active : ''}`}
                                    style={{ backgroundColor: color.color_code }}
                                />
                                <span className={styles.colorName}>{color.color}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Grades */}
            {availableFilters.grades && (
                <div className={styles.filterGroup}>
                    <div className={styles.filterHeader}>Grades</div>
                    <ul className={styles.filterList}>
                        {availableFilters.grades.map((grade: string) => (
                            <li key={grade} className={styles.filterItem} onClick={() => handleMultiSelect('grade', grade)}>
                                <input type="checkbox" checked={selectedFilters.grade.includes(grade)} readOnly />
                                {grade}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Screen Sizes - COMMENTED OUT */}
            {/* {availableFilters.screen_sizes && (
                <div className={styles.filterGroup}>
                    <div className={styles.filterHeader}>Screen Size</div>
                    <ul className={styles.filterList}>
                        {availableFilters.screen_sizes.map((size: string) => (
                            <li key={size} className={styles.filterItem} onClick={() => handleMultiSelect('screen_size', size)}>
                                <input type="checkbox" checked={selectedFilters.screen_size.includes(size)} readOnly />
                                {size}
                            </li>
                        ))}
                    </ul>
                </div>
            )} */}

            <button onClick={onClearAll} className={styles.clearAllBtn}>
                Clear All Filters
            </button>
        </aside>
    );
};

export default Sidebar;
