"use client";
import React, { useEffect } from "react";
import FiltersSidebartest from "@/components/productDetailtest/FiltersSidebartest";
import ProductGallerytest from "@/components/productDetailtest/ProductGallerytest";
import ProductInfotest from "@/components/productDetailtest/ProductInfotest";
import AddToCartSectiontest from "@/components/productDetailtest/AddToCartSectiontest";
import ProductSpecstest from "@/components/productDetailtest/ProductSpecstest";
import RelatedProductstest from "@/components/productDetailtest/RelatedProductstest";
import { ProductTest, RelatedProductTest, VariantTest } from "@/types/producttest";
// import styles from "./page.module.css";
import styles from "./ProductDetailTestPage.module.css";
import ProductSlider from "../home/ProductSlider";
import TrustBadge from "../product/TrustBadge";
import ReviewsSection from "../product/ReviewSection";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { clearProduct, fetchProductById } from "@/redux/features/productSlice";


const mockRelatedProducts: RelatedProductTest[] = [
    {
        id: 2,
        title: "iPhone 13 Pro",
        subtitle: '6.7" BLEED, A15',
        price: 999,
        image: "/images/img20.png",
    },
    {
        id: 3,
        title: "Google Pixel 6",
        subtitle: '6.7" BLEED, 50MP',
        price: 899,
        image: "/images/img20.png",
    },
    {
        id: 4,
        title: "OnePlus 9 Pro",
        subtitle: '6.7" KUBI AWOLED',
        price: 849,
        image: "/images/img20.png",
    },
    {
        id: 5,
        title: "OnePlus 9 Pro",
        subtitle: '6.7" KUBI AWOLED',
        price: 849,
        image: "/images/img20.png",
    },
    {
        id: 6,
        title: "OnePlus 9 Pro",
        subtitle: '6.7" KUBI AWOLED',
        price: 849,
        image: "/images/img20.png",
    },

];


// const mockSpecs: ProductSpecTest[] = [
//     { label: "Brand", value: "Samsung" },
//     {
//         label: "Display",
//         value: '6.8" Dynamic AMOLED 2X , 3200 x 1440 (120Hz Refresh Rate)',
//     },
//     {
//         label: "Processor",
//         value: "Exynos 2100 (Global) / Snapdragon 888 (US)",
//     },
//     {
//         label: "Camera",
//         value: "108MP + 10MP + 10MP + 12MP Rear 40MP Front",
//     },
//     {
//         label: "RAM/Storage",
//         value: "12GB RAM, 128GB / 256GB / 512GB options",
//     },
// ];
interface ProductDetailTestPageProps {
    productId: string;
}

const ProductDetailTestPage: React.FC<ProductDetailTestPageProps> = ({ productId }) => {

    // export default function ProductDetailTestPage() {
    const dispatch = useDispatch<AppDispatch>();
    const [selectedVariant, setSelectedVariant] = React.useState<VariantTest | null>(null);
    const { product, isLoading, error } = useSelector(
        (state: RootState) => state.product,
    );

    useEffect(() => {
        dispatch(fetchProductById(productId));

        // clear stale data when navigating away
        return () => {
            dispatch(clearProduct());
        };
    }, [dispatch, productId]);

    useEffect(() => {
        if (product?.variants?.length) {
            setSelectedVariant(product.variants[0]);
        }
    }, [product]);

    // console.log(product);
    console.log(selectedVariant?.images?.[0]?.thumbnail_url);

    return (
        <div className={styles.pageWrapper}>
            {/* Breadcrumb */}
            <nav className={styles.breadcrumb}>
                <span>Home</span>
                <span className={styles.breadcrumbSep}>&gt;</span>
                <span>Smartphones</span>
                <span className={styles.breadcrumbSep}>&gt;</span>
                <span className={styles.breadcrumbActive}>{product?.name || "Product"}</span>
            </nav>

            {/* Main layout */}
            <div className={styles.mainLayout}>
                {/* Left Sidebar */}
                {/* <FiltersSidebartest /> */}

                {/* Center: Gallery + Info + Specs */}
                <div className={styles.centerContent}>
                    <div className={styles.productRow}>
                        {/* <ProductGallerytest product={mockProduct} /> */}
                        <ProductGallerytest product={product} selectedVariant={selectedVariant} />

                        <div className={styles.infoColumn}>
                            <ProductInfotest
                                product={product}
                                selectedVariant={selectedVariant}
                                setSelectedVariant={setSelectedVariant}
                            />
                            <AddToCartSectiontest
                                product={product}
                                selectedVariant={selectedVariant}
                                showWishlist={false}
                                showBuyNow={true}
                            />
                            <div className={styles.specsSection}>
                                <ProductSpecstest product={product} selectedVariant={selectedVariant} />
                            </div>

                        </div>
                    </div>


                </div>

                {/* Right Sidebar */}
                <div className={styles.relatedSidebar}>
                    <RelatedProductstest products={mockRelatedProducts} />
                </div>
            </div>
            {/* <ProductSlider /> */}

            {/* <TrustBadge />
            <ReviewsSection /> */}
        </div>
    );
}
export default ProductDetailTestPage;