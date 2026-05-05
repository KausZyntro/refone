"use client"
import React from 'react';
import OrderStatusBadge from './OrderStatusBadge';
import OrdersTimeline from './OrdersTimeline';

// Interface matching the API response shape
export interface OrderItemAPI {
    order_item_id: number;
    order_id: number;
    status: string;
    order_date: string;
    product_id: number;
    variant_id: number;
    product: {
        id: number;
        name: string;
        images: {
            id: number;
            variant_id: number;
            image_url: string;
            thumbnail_url: string;
            is_primary: number;
            created_at: string;
        }[];
    };
    variant: {
        id: number;
        storage: string;
        color: string;
        sku: string;
    };
    quantity: number;
    price: string;
    total: string;
}

interface OrderCardProps {
    order: OrderItemAPI;
}

const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
    const primaryImage = order.product?.images?.find(img => img.is_primary === 1);
    const imageUrl = primaryImage?.image_url || order.product?.images?.[0]?.image_url || '';

    const formatPrice = (price: string | number) => {
        const num = typeof price === 'string' ? parseFloat(price) : price;
        return `₹${num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    return (
        <div className="order-card">
            <div className="order-card-header">
                <div className="order-meta">
                    <span className="order-id">Order #{order.order_id}</span>
                    <span className="order-date">Placed on {formatDate(order.order_date)}</span>
                </div>
                <OrderStatusBadge status={order.status} />
            </div>

            <div className="order-body">
                <img 
                    src={imageUrl || '/placeholder.png'} 
                    alt={order.product?.name} 
                    className="product-img" 
                />
                <div className="product-details">
                    <h3>{order.product?.name}</h3>
                    <p className="product-description">
                        {order.variant?.storage}, {order.variant?.color}
                    </p>
                    <div className="order-specs">
                        <span>Qty: <strong>{order.quantity}</strong></span>
                        <span>Price: <strong>{formatPrice(order.price)}</strong></span>
                        <span>Total: <strong>{formatPrice(order.total)}</strong></span>
                    </div>
                </div>
            </div>

            <OrdersTimeline status={order.status} />

            <div className="order-actions">
                {order.status === 'delivered' && (
                    <button className="btn-order btn-primary">Buy Again</button>
                )}
                {(order.status === 'placed' || order.status === 'processing') && (
                    <button className="btn-order btn-danger">Cancel Order</button>
                )}
            </div>
        </div>
    );
};

export default OrderCard;
