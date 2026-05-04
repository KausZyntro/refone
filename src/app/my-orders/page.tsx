"use client"
import React, { useState, useMemo, useEffect } from 'react';
import "@/styles/Orders.css";
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { fetchOrderList } from '@/redux/features/orderSlice';
import OrderCard from '@/components/orders/OrderCard';
import type { OrderItemAPI } from '@/components/orders/OrderCard';
import OrderFilters from '@/components/orders/OrderFilters';
import EmptyOrdersState from '@/components/orders/EmptyOrdersState';

const MyOrdersPage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { user } = useSelector((state: RootState) => state.auth);
    const { orders, isLoading, error } = useSelector((state: RootState) => state.order);

    const [activeTab, setActiveTab] = useState('All Orders');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('latest');

    useEffect(() => {
        if (user?.id) {
            dispatch(fetchOrderList(Number(user.id)));
        }
    }, [dispatch, user?.id]);

    const filteredOrders = useMemo(() => {
        const ordersList = (orders || []) as OrderItemAPI[];
        return ordersList
            .filter(order => {
                const matchesTab = activeTab === 'All Orders' || order.status === activeTab;
                const matchesSearch =
                    String(order.order_id).includes(searchQuery) ||
                    order.product?.name?.toLowerCase().includes(searchQuery.toLowerCase());
                return matchesTab && matchesSearch;
            })
            .sort((a, b) => {
                if (sortBy === 'latest') return new Date(b.order_date).getTime() - new Date(a.order_date).getTime();
                if (sortBy === 'oldest') return new Date(a.order_date).getTime() - new Date(b.order_date).getTime();
                if (sortBy === 'price_high') return parseFloat(b.total) - parseFloat(a.total);
                if (sortBy === 'price_low') return parseFloat(a.total) - parseFloat(b.total);
                return 0;
            });
    }, [orders, activeTab, searchQuery, sortBy]);

    return (
        <main className="orders-page">
            <div className="orders-container">
                <div className="orders-header">
                    <div className="breadcrumb">
                        <Link href="/">Home</Link> / My Orders
                    </div>
                    <div className="orders-title-section">
                        <h1>My Orders</h1>
                        <p className="orders-subtitle">Track your recent purchases and order status</p>
                    </div>
                </div>

                {/* Filter Section */}
                <OrderFilters
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                    onSearch={setSearchQuery}
                    onSort={setSortBy}
                />

                {/* Orders List */}
                <div className="order-list">
                    {isLoading ? (
                        // Skeleton loader
                        Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="order-card skeleton-order-card">
                                <div className="skeleton-line" style={{ width: '40%', height: '18px', marginBottom: '12px' }} />
                                <div style={{ display: 'flex', gap: '16px' }}>
                                    <div className="skeleton-line" style={{ width: '100px', height: '100px', borderRadius: '12px' }} />
                                    <div style={{ flex: 1 }}>
                                        <div className="skeleton-line" style={{ width: '60%', height: '16px', marginBottom: '8px' }} />
                                        <div className="skeleton-line" style={{ width: '40%', height: '14px', marginBottom: '8px' }} />
                                        <div className="skeleton-line" style={{ width: '50%', height: '14px' }} />
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : error ? (
                        <div className="empty-orders">
                            <h2>Something went wrong</h2>
                            <p>{error}</p>
                            <button
                                className="btn-shop"
                                onClick={() => user?.id && dispatch(fetchOrderList(Number(user.id)))}
                            >
                                Try Again
                            </button>
                        </div>
                    ) : filteredOrders.length > 0 ? (
                        filteredOrders.map(order => (
                            <OrderCard key={order.order_item_id} order={order} />
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
