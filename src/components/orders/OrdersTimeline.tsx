import React from 'react';
import { FiCheckCircle } from 'react-icons/fi';

interface OrdersTimelineProps {
    status: string;
}

const OrdersTimeline: React.FC<OrdersTimelineProps> = ({ status }) => {
    const normalizedStatus = status.toLowerCase().replace(/\s+/g, '_');

    // Define steps and which statuses they are considered complete at
    const steps = [
        { label: 'Order Placed', shortLabel: 'Placed', key: 'placed' },
        { label: 'Processing', shortLabel: 'Proc.', key: 'processing' },
        { label: 'Confirmed', shortLabel: 'Conf.', key: 'confirmed' },
        { label: 'Shipped', shortLabel: 'Ship', key: 'shipped' },
        { label: 'Delivered', shortLabel: 'Done', key: 'delivered' },
    ];

    // Order of progression
    const statusOrder = ['placed', 'processing', 'confirmed', 'shipped', 'out_for_delivery', 'delivered'];

    if (normalizedStatus === 'cancelled') return null;

    const currentIndex = statusOrder.indexOf(normalizedStatus);

    return (
        <div className="order-timeline-container">
            <div className="order-timeline">
                {steps.map((step, index) => {
                    const stepIndex = statusOrder.indexOf(step.key);
                    const isCompleted = currentIndex > stepIndex;
                    const isActive = currentIndex === stepIndex;

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
