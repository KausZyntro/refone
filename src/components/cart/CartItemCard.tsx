"use client";

import React from "react";
import Image from "next/image";
import { FiTrash2 } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { updateItemQuantity, removeItem, removeFromCart, updateCartQuantityThunk, increaseQuantity, decreaseQuantity } from "@/redux/features/cartSlice";
import type { CartItem } from "@/types/cart";
import QuantityControl from "./QuantityControl";
import { AppDispatch, RootState } from "@/redux/store";
import { formatPrice, parsePrice } from "@/utils/format";

interface CartItemCardProps {
    item: CartItem;
}

const CartItemCard: React.FC<CartItemCardProps> = ({ item }) => {
    const dispatch = useDispatch<AppDispatch>();
    const { user } = useSelector((state: RootState) => state.auth);
    const quantity = Number(item.quantity) || 1;

    // Resilient variant extraction
    const variantInfo = Array.isArray(item.variant) ? item.variant[0] : item.variant;
    const storageInfo = variantInfo?.storage ? `${variantInfo.storage} Storage` : "";
    const colorInfo = variantInfo?.color ? `${variantInfo.color} Color` : "";
    const variantDetails = [storageInfo, colorInfo].filter(Boolean).join(" | ");

    const handleIncrease = () => {
        if (user?.id) {
            dispatch(updateCartQuantityThunk({ cart_id: item.id, action: "increase" }));
        } else {
            dispatch(increaseQuantity({ id: item.id }));
        }
    };

    const handleDecrease = () => {
        if (quantity > 1) {
            if (user?.id) {
                dispatch(updateCartQuantityThunk({ cart_id: item.id, action: "decrease" }));
            } else {
                dispatch(decreaseQuantity({ id: item.id }));
            }
        }
    };
    console.log(item.id);

    const handleRemove = () => {
        dispatch(removeItem({ id: item.id }));
        dispatch(removeFromCart(item.id));
    };

    const priceAmount = parsePrice(item.price?.selling_price);
    const itemTotal = item.item_total || (priceAmount * quantity);

    const imageUrl = variantInfo?.images?.[0]?.image_url || item.product?.image;
    console.log(imageUrl)

    return (
        <div className="cart-item-card">
            <div className="cart-item-image-wrapper">
                <img
                    src={imageUrl || '/placeholder.png'}
                    alt={item.product?.name}
                    className="cart-item-image"
                    sizes="(max-width: 768px) 96px, 112px"
                />
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
                            {formatPrice(itemTotal)}
                        </div>
                        {quantity > 1 && (
                            <div className="cart-item-unit-price">
                                {formatPrice(priceAmount)} each
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartItemCard;
