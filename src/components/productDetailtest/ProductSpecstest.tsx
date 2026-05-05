"use client";

import React, { useState } from "react";
import styles from "./ProductSpecstest.module.css";
import { ProductTest, VariantTest } from "@/types/producttest";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

interface ProductSpecsTestProps {
    product: ProductTest;
    selectedVariant: VariantTest | null;
}

const ProductSpecstest: React.FC<ProductSpecsTestProps> = ({ product, selectedVariant }) => {
    const [isOpen, setIsOpen] = useState(true);

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
            <div className={styles.specsHeader} onClick={() => setIsOpen(!isOpen)}>
                {/* <h3 className={styles.specsTitle}>Specifications</h3> */}
                {/* <div className={styles.iconWrapper}>
                    {isOpen ? <FiChevronUp className={styles.icon} /> : <FiChevronDown className={styles.icon} />}
                </div> */}
            </div>
            
            <div className={`${styles.tableContainer} ${isOpen ? styles.open : styles.closed}`}>
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
        </div>
    );
};

export default ProductSpecstest;
