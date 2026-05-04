"use client"
import React from 'react';
import { FiSearch } from 'react-icons/fi';

interface OrderFiltersProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
    onSearch: (id: string) => void;
    onSort: (value: string) => void;
}

const OrderFilters: React.FC<OrderFiltersProps> = ({ activeTab, onTabChange, onSearch, onSort }) => {
    const tabs = ['All Orders', 'placed', 'processing', 'confirmed', 'shipped', 'delivered', 'cancelled'];

    const tabLabels: Record<string, string> = {
        'All Orders': 'All Orders',
        placed: 'Placed',
        processing: 'Processing',
        confirmed: 'Confirmed',
        shipped: 'Shipped',
        delivered: 'Delivered',
        cancelled: 'Cancelled',
    };

    return (
        <div className="orders-filters-container">
            <div className="filter-tabs">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        className={`filter-tab ${activeTab === tab ? 'active' : ''}`}
                        onClick={() => onTabChange(tab)}
                    >
                        {tabLabels[tab] || tab}
                    </button>
                ))}
            </div>

            <div className="filter-actions">
                <div className="search-id">
                    <FiSearch />
                    <input
                        type="text"
                        placeholder="Search by product name or order ID"
                        onChange={(e) => onSearch(e.target.value)}
                    />
                </div>

                <div className="sort-dropdown">
                    <select onChange={(e) => onSort(e.target.value)}>
                        <option value="latest">Latest First</option>
                        <option value="oldest">Oldest First</option>
                        <option value="price_high">Price High to Low</option>
                        <option value="price_low">Price Low to High</option>
                    </select>
                </div>
            </div>
        </div>
    );
};

export default OrderFilters;
