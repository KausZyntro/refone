"use client";

import React from "react";
import { FiMinus, FiPlus } from "react-icons/fi";

interface QuantityControlProps {
    quantity: number;
    onIncrease: () => void;
    onDecrease: () => void;
    disabled?: boolean;
}

const QuantityControl: React.FC<QuantityControlProps> = ({
    quantity,
    onIncrease,
    onDecrease,
    disabled = false,
}) => {
    return (
        <div className="qty-control">
            <button
                type="button"
                className="qty-btn"
                onClick={onDecrease}
                disabled={disabled || quantity <= 1}
                aria-label="Decrease quantity"
            >
                <FiMinus size={14} />
            </button>
            <span className="qty-value">{quantity}</span>
            <button
                type="button"
                className="qty-btn"
                onClick={onIncrease}
                disabled={disabled}
                aria-label="Increase quantity"
            >
                <FiPlus size={14} />
            </button>
        </div>
    );
};

export default QuantityControl;
