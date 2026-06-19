"use client";

import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useRazorpay } from "@/hooks/useRazorpay";

interface RazorpayButtonProps {
    className?: string;
    disabled?: boolean;
    label?: string;
    amount?: number;
}

const RazorpayButton: React.FC<RazorpayButtonProps> = ({ className, disabled, label = "Proceed to Payment", amount }) => {
    const { items, pricing, totalQuantity } = useSelector((state: RootState) => state.cart);
    const { addresses, selectedAddressId } = useSelector((state: RootState) => state.address);
    const { isLoading: isPlacingOrder, isProcessingPayment } = useSelector((state: RootState) => state.order);

    const grandTotal = amount !== undefined ? amount : (pricing?.grand_total || 0);

    const { initiatePayment } = useRazorpay({
        amount: grandTotal,
        items,
        addressId: selectedAddressId,
    });

    const isButtonDisabled = disabled || addresses.length === 0 || !selectedAddressId || totalQuantity === 0 || isPlacingOrder || isProcessingPayment;

    const getButtonText = () => {
        if (isPlacingOrder || isProcessingPayment) return "Processing...";
        if (addresses.length === 0) return "Add Address First";
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
