import React from 'react';
import { FiCheckCircle } from 'react-icons/fi';
import { OrderStatus } from './OrderStatusBadge';

interface OrdersTimelineProps {
    status: OrderStatus;
}

const OrdersTimeline: React.FC<OrdersTimelineProps> = ({ status }) => {
    const steps = [
        { label: 'Order Placed', shortLabel: 'Placed', statuses: ['Pending', 'Confirmed', 'Shipped', 'Out for Delivery', 'Delivered'] },
        { label: 'Confirmed', shortLabel: 'Conf.', statuses: ['Confirmed', 'Shipped', 'Out for Delivery', 'Delivered'] },
        { label: 'Shipped', shortLabel: 'Ship', statuses: ['Shipped', 'Out for Delivery', 'Delivered'] },
        { label: 'Out for Delivery', shortLabel: 'Out', statuses: ['Out for Delivery', 'Delivered'] },
        { label: 'Delivered', shortLabel: 'Done', statuses: ['Delivered'] },
    ];

    if (status === 'Cancelled') return null;

    return (
        <div className="order-timeline-container">
            <div className="order-timeline">
                {steps.map((step, index) => {
                    const isCompleted = step.statuses.includes(status) && status !== step.statuses[0];
                    const isActive = status === step.statuses[0];

                    return (
                        <div
                            key={index}
                            className={`timeline-step ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}`}
                        >
                            <div className="step-circle">
                                {isCompleted ? <FiCheckCircle /> : index + 1}
                            </div>
                            <div className="step-label desktop-only">{step.label}</div>
                            <div className="step-label mobile-only">{step.shortLabel}</div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default OrdersTimeline;
