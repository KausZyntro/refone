"use client"
import React from 'react';
import { FiShoppingBag } from 'react-icons/fi';
import Link from 'next/link';

const EmptyOrdersState: React.FC = () => {
    return (
        <div className="empty-orders">
            <div className="empty-icon">
                <FiShoppingBag />
            </div>
            <h2>You have not placed any orders yet</h2>
            <p>Explore our wide range of certified refurbished devices and accessories.</p>
            <Link href="/allProduct" className="btn-shop">
                Start Shopping
            </Link>
        </div>
    );
};

export default EmptyOrdersState;
