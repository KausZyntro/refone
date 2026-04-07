import React from 'react';

export type OrderStatus = 'Pending' | 'Confirmed' | 'Shipped' | 'Out for Delivery' | 'Delivered' | 'Cancelled';

interface OrderStatusBadgeProps {
    status: OrderStatus;
}

const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({ status }) => {
    const statusClass = status.toLowerCase().replace(/\s+/g, '_');

    return (
        <span className={`status-badge status-${statusClass}`}>
            {status}
        </span>
    );
};

export default OrderStatusBadge;
