"use client";

import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useRazorpay } from "@/hooks/useRazorpay";

interface RazorpayButtonProps {
    className?: string;
    disabled?: boolean;
    label?: string;
}

const RazorpayButton: React.FC<RazorpayButtonProps> = ({ className, disabled, label = "Proceed to Payment" }) => {
    const { items, pricing, totalQuantity } = useSelector((state: RootState) => state.cart);
    const { selectedAddressId } = useSelector((state: RootState) => state.address);
    const { isLoading: isPlacingOrder, isProcessingPayment } = useSelector((state: RootState) => state.order);

    const grandTotal = pricing?.grand_total || 0;

    const { initiatePayment } = useRazorpay({
        amount: grandTotal,
        items,
        addressId: selectedAddressId,
    });

    const isButtonDisabled = disabled || !selectedAddressId || totalQuantity === 0 || isPlacingOrder || isProcessingPayment;

    const getButtonText = () => {
        if (isPlacingOrder || isProcessingPayment) return "Processing...";
        if (!selectedAddressId && totalQuantity > 0) return "Select Address";
        return label;
    };

    return (
        <button
            className={className}
            disabled={isButtonDisabled}
            onClick={initiatePayment}
        >
            {getButtonText()}
        </button>
    );
};

export default RazorpayButton;
