import React from 'react';

export type OrderStatus = 'placed' | 'processing' | 'confirmed' | 'shipped' | 'out_for_delivery' | 'delivered' | 'cancelled';

const STATUS_LABELS: Record<string, string> = {
    placed: 'Placed',
    processing: 'Processing',
    confirmed: 'Confirmed',
    shipped: 'Shipped',
    out_for_delivery: 'Out for Delivery',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
};

interface OrderStatusBadgeProps {
    status: OrderStatus | string;
}

const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({ status }) => {
    const normalizedStatus = status.toLowerCase().replace(/\s+/g, '_');
    const label = STATUS_LABELS[normalizedStatus] || status;

    return (
        <span className={`status-badge status-${normalizedStatus}`}>
            {label}
        </span>
    );
};

export default OrderStatusBadge;
