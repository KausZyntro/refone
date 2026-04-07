"use client"
import React from 'react';
import {
    FiFileText,
    FiClock,
    FiTruck,
    FiCheckCircle,
    FiXCircle
} from 'react-icons/fi';

interface SummaryCardProps {
    label: string;
    count: number;
    type: 'total' | 'pending' | 'shipped' | 'delivered' | 'cancelled';
}

const OrderSummaryCard: React.FC<SummaryCardProps> = ({ label, count, type }) => {
    const getStyles = () => {
        switch (type) {
            case 'total':
                return { icon: <FiFileText />, bg: '#eef2ff', color: '#4f46e5' };
            case 'pending':
                return { icon: <FiClock />, bg: '#fff7ed', color: '#f59e0b' };
            case 'shipped':
                return { icon: <FiTruck />, bg: '#f5f3ff', color: '#8b5cf6' };
            case 'delivered':
                return { icon: <FiCheckCircle />, bg: '#f0fdf4', color: '#10b981' };
            case 'cancelled':
                return { icon: <FiXCircle />, bg: '#fef2f2', color: '#ef4444' };
            default:
                return { icon: <FiFileText />, bg: '#f3f4f6', color: '#6b7280' };
        }
    };

    const { icon, bg, color } = getStyles();

    return (
        <div className="summary-card">
            <div className="summary-icon" style={{ backgroundColor: bg, color: color }}>
                {icon}
            </div>
            <div className="summary-info">
                <h4>{label}</h4>
                <div className="summary-count">{count}</div>
            </div>
        </div>
    );
};

export default OrderSummaryCard;
