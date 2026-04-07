"use client"
import React from 'react';
import OrderStatusBadge, { OrderStatus } from './OrderStatusBadge';
import OrdersTimeline from './OrdersTimeline';

export interface OrderItem {
    id: string;
    productName: string;
    shortDescription: string;
    price: number;
    quantity: number;
    status: OrderStatus;
    paymentMethod: string;
    orderDate: string;
    estimatedDelivery: string;
    image: string;
}

interface OrderCardProps {
    order: OrderItem;
}

const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
    return (
        <div className="order-card">
            <div className="order-card-header">
                <div className="order-meta">
                    <span className="order-id">Order {order.id}</span>
                    <span className="order-date">Placed on {new Date(order.orderDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                </div>
                <OrderStatusBadge status={order.status} />
            </div>

            <div className="order-body">
                <img src={order.image} alt={order.productName} className="product-img" />
                <div className="product-details">
                    <h3>{order.productName}</h3>
                    <p className="product-description">{order.shortDescription}</p>
                    <div className="order-specs">
                        <span>Qty: <strong>{order.quantity}</strong></span>
                        <span>Price: <strong>₹{order.price.toLocaleString('en-IN')}</strong></span>
                        <span>Payment: <strong>{order.paymentMethod}</strong></span>
                    </div>
                </div>
            </div>

            <OrdersTimeline status={order.status} />

            <div className="order-actions">
                <button className="btn-order btn-secondary">View Details</button>
                <button className="btn-order btn-outline">Track Order</button>
                <button className="btn-order btn-secondary">Download Invoice</button>

                {order.status === 'Pending' && (
                    <button className="btn-order btn-danger">Cancel Order</button>
                )}

                {order.status === 'Delivered' && (
                    <button className="btn-order btn-primary">Buy Again</button>
                )}
            </div>
        </div>
    );
};

export default OrderCard;
