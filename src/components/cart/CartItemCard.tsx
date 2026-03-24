"use client";

import React from "react";
import Image from "next/image";
import { FiTrash2 } from "react-icons/fi";
import { useDispatch } from "react-redux";
import { updateItemQuantity, removeItem } from "@/redux/features/cartSlice";
import type { CartItem } from "@/types/cart";
import QuantityControl from "./QuantityControl";

interface CartItemCardProps {
    item: CartItem;
}

const CartItemCard: React.FC<CartItemCardProps> = ({ item }) => {
    const dispatch = useDispatch();
    const quantity = Number(item.quantity) || 1;

    const variantInfo = item.variant?.[0];
    const storageInfo = variantInfo?.storage ? `${variantInfo.storage} Storage` : "";
    const colorInfo = variantInfo?.color ? `${variantInfo.color} Color` : "";
    const variantDetails = [storageInfo, colorInfo].filter(Boolean).join(" | ");

    const handleIncrease = () => {
        dispatch(updateItemQuantity({ id: item.id, quantity: quantity + 1 }));
    };

    const handleDecrease = () => {
        if (quantity > 1) {
            dispatch(updateItemQuantity({ id: item.id, quantity: quantity - 1 }));
        }
    };

    const handleRemove = () => {
        dispatch(removeItem({ id: item.id }));
    };

    const priceAmount = Number(item.price?.selling_price || 0);
    const itemTotal = item.item_total || (priceAmount * quantity);

    const imageUrl = item.variant?.[0]?.images?.[0]?.image_url;
    console.log(imageUrl)

    return (
        <div className="cart-item-card">
            <div className="cart-item-image-wrapper">
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={item.product.name}
                        // fill
                        className="cart-item-image"
                        sizes="(max-width: 768px) 96px, 112px"
                    />
                ) : (
                    <div className="cart-item-no-image">No Image</div>
                )}
            </div>

            <div className="cart-item-content">
                <div className="cart-item-header">
                    <h3 className="cart-item-title">
                        {item.product?.name || "Unknown Product"}
                    </h3>
                    {variantDetails && (
                        <p className="cart-item-variant">{variantDetails}</p>
                    )}
                </div>

                <div className="cart-item-actions">
                    <div className="cart-item-controls">
                        <QuantityControl
                            quantity={quantity}
                            onIncrease={handleIncrease}
                            onDecrease={handleDecrease}
                        />
                        <button
                            className="cart-item-remove"
                            onClick={handleRemove}
                            aria-label="Remove item"
                        >
                            <FiTrash2 size={16} />
                            <span>Remove</span>
                        </button>
                    </div>

                    <div className="cart-item-pricing">
                        <div className="cart-item-total">
                            ₹{itemTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                        {quantity > 1 && (
                            <div className="cart-item-unit-price">
                                {priceAmount.toLocaleString()} each
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartItemCard;
