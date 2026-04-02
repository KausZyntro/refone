"use client";

import React from "react";
import styles from "./ProductSpecstest.module.css";
import { ProductTest, VariantTest } from "@/types/producttest";
// import { ProductSpecTest } from "@/types/producttest";

interface ProductSpecsTestProps {
    product: ProductTest;
    selectedVariant: VariantTest | null;
}

const ProductSpecstest: React.FC<ProductSpecsTestProps> = ({ product, selectedVariant }) => {
    const specs = [
        { label: "Brand", value: product?.brand?.name },
        { label: "Model", value: product?.name },
        { label: "Display", value: product?.screen_size },
        { label: "Battery", value: product?.battery_capacity },
        { label: "Front Camera", value: product?.front_camera },
        { label: "Back Camera", value: product?.back_camera },
        { label: "Network", value: product?.network_support },
        { label: "SIM Slots", value: product?.sim_slots },
        { label: "Storage", value: selectedVariant?.storage },
        { label: "Color", value: selectedVariant?.color },
        { label: "Weight", value: selectedVariant?.weight },
        { label: "SKU", value: selectedVariant?.sku },
    ];

    return (
        <div className={styles.specsSection}>
            <h3 className={styles.specsTitle}>Specifications</h3>
            <table className={styles.specsTable}>
                <tbody>
                    {specs.map((spec, index) => (
                        spec.value && (
                            <tr key={index}>
                                <td className={styles.labelCell}>{spec.label}</td>
                                <td className={styles.valueCell}>{spec.value}</td>
                            </tr>
                        )
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ProductSpecstest;
