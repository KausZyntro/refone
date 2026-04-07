"use client"
import React, { useState, useMemo } from 'react';
import "@/styles/Orders.css";
import Link from 'next/link';
import OrderSummaryCard from '@/components/orders/OrderSummaryCard';
import OrderCard, { OrderItem } from '@/components/orders/OrderCard';
import OrderFilters from '@/components/orders/OrderFilters';
import EmptyOrdersState from '@/components/orders/EmptyOrdersState';

const DUMMY_ORDERS: OrderItem[] = [
    {
        id: '#ORD10234',
        productName: 'iPhone 15 Pro Max',
        shortDescription: 'Natural Titanium, 256GB - Certified Refurbished',
        price: 98990,
        quantity: 1,
        status: 'Shipped',
        paymentMethod: 'UPI',
        orderDate: '2026-04-05',
        estimatedDelivery: '2026-04-10',
        image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=1000&auto=format&fit=crop'
    },
    {
        id: '#ORD10235',
        productName: 'AirPods Pro (2nd Generation)',
        shortDescription: 'MagSafe Case (USB‑C) - Like New',
        price: 18990,
        quantity: 1,
        status: 'Pending',
        paymentMethod: 'COD',
        orderDate: '2026-04-06',
        estimatedDelivery: '2026-04-12',
        image: 'data:image/jpeg;base64,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'
    },
    {
        id: '#ORD10236',
        productName: 'MacBook Air M2',
        shortDescription: 'Midnight, 8GB RAM, 256GB SSD - Excellent Condition',
        price: 74990,
        quantity: 1,
        status: 'Delivered',
        paymentMethod: 'Credit Card',
        orderDate: '2026-03-28',
        estimatedDelivery: '2026-04-02',
        image: 'https://www.apple.com/newsroom/images/product/mac/standard/Apple-WWDC22-MacBook-Air-hero-220606_big.jpg.large.jpg'
    },
    {
        id: '#ORD10237',
        productName: 'Apple Watch Series 9',
        shortDescription: 'Midnight Aluminum Case, Starlight Solo Loop',
        price: 32900,
        quantity: 1,
        status: 'Cancelled',
        paymentMethod: 'UPI',
        orderDate: '2026-03-25',
        estimatedDelivery: '2026-03-30',
        image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=1000&auto=format&fit=crop'
    }
];

const MyOrdersPage = () => {
    const [activeTab, setActiveTab] = useState('All Orders');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('latest');

    const filteredOrders = useMemo(() => {
        return DUMMY_ORDERS
            .filter(order => {
                const matchesTab = activeTab === 'All Orders' || order.status === activeTab;
                const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    order.productName.toLowerCase().includes(searchQuery.toLowerCase());
                return matchesTab && matchesSearch;
            })
            .sort((a, b) => {
                if (sortBy === 'latest') return new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime();
                if (sortBy === 'oldest') return new Date(a.orderDate).getTime() - new Date(b.orderDate).getTime();
                if (sortBy === 'price_high') return b.price - a.price;
                if (sortBy === 'price_low') return a.price - b.price;
                return 0;
            });
    }, [activeTab, searchQuery, sortBy]);

    const summary = useMemo(() => {
        return {
            total: DUMMY_ORDERS.length,
            pending: DUMMY_ORDERS.filter(o => o.status === 'Pending').length,
            shipped: DUMMY_ORDERS.filter(o => o.status === 'Shipped').length,
            delivered: DUMMY_ORDERS.filter(o => o.status === 'Delivered').length,
            cancelled: DUMMY_ORDERS.filter(o => o.status === 'Cancelled').length,
        };
    }, []);

    return (
        <main className="orders-page">
            <div className="orders-container">
                {/* Breadcrumb & Header */}
                <div className="orders-header">
                    <div className="breadcrumb">
                        <Link href="/">Home</Link> / My Orders
                    </div>
                    <div className="orders-title-section">
                        <h1>My Orders</h1>
                        <p className="orders-subtitle">Track your recent purchases and order status</p>
                    </div>
                </div>

                {/* Summary Cards */}
                {/* <div className="summary-grid">
                    <OrderSummaryCard label="Total Orders" count={summary.total} type="total" />
                    <OrderSummaryCard label="Pending Orders" count={summary.pending} type="pending" />
                    <OrderSummaryCard label="Shipped Orders" count={summary.shipped} type="shipped" />
                    <OrderSummaryCard label="Delivered Orders" count={summary.delivered} type="delivered" />
                    <OrderSummaryCard label="Cancelled Orders" count={summary.cancelled} type="cancelled" />
                </div> */}

                {/* Filter Section */}
                <OrderFilters
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                    onSearch={setSearchQuery}
                    onSort={setSortBy}
                />

                {/* Orders List */}
                <div className="order-list">
                    {filteredOrders.length > 0 ? (
                        filteredOrders.map(order => (
                            <OrderCard key={order.id} order={order} />
                        ))
                    ) : (
                        <EmptyOrdersState />
                    )}
                </div>
            </div>
        </main>
    );
};

export default MyOrdersPage;
