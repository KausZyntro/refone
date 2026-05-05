"use client";
import React, { useEffect, useState } from "react";
import ProductGallerytest from "@/components/productDetailtest/ProductGallerytest";
import ProductInfotest from "@/components/productDetailtest/ProductInfotest";
import ProductSpecstest from "@/components/productDetailtest/ProductSpecstest";
import { ProductTest, VariantTest } from "@/types/producttest";
import styles from "./ProductDetailTestPage.module.css";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { clearProduct, fetchProductById } from "@/redux/features/productSlice";
import { addToCart, addLocalItem } from "@/redux/features/cartSlice";
import { openLoginModal, setRedirectPath } from "@/redux/features/authSlice";
import { productAPI } from "@/services/api";
import { useRouter } from "next/navigation";
import { parsePrice } from "@/utils/format";
import { toast } from "react-toastify";
import {
    FiChevronRight,
    FiEye,
    FiCheckCircle,
    FiShield,
    FiTruck,
    FiRefreshCw,
    FiCreditCard,
    FiChevronDown,
    FiChevronUp,
    FiRepeat,
} from "react-icons/fi";
import { FaCreditCard, FaShoppingCart } from "react-icons/fa";

interface ProductDetailTestPageProps {
    productId: string;
}

type TabKey = "highlights" | "specs" | "box" | "faq" | "reviews";

const TABS: { key: TabKey; label: string }[] = [
    { key: "highlights", label: "Product Details" },
    { key: "specs", label: "Specifications" },
    { key: "box", label: "What's in the Box" },
    { key: "faq", label: "FAQs" },
    { key: "reviews", label: "Customer Reviews (12,458)" },
];

const ProductDetailTestPage: React.FC<ProductDetailTestPageProps> = ({ productId }) => {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();

    /* ── state ── */
    const [selectedVariant, setSelectedVariant] = React.useState<VariantTest | null>(null);
    const [activeTab, setActiveTab] = useState<TabKey>("highlights");
    const [openAccordion, setOpenAccordion] = useState<TabKey | null>(null);
    const [addedToCart, setAddedToCart] = useState(false);
    const [isCartLoading, setIsCartLoading] = useState(false);

    /* ── redux ── */
    const { product } = useSelector((state: RootState) => state.product);
    const { user } = useSelector((state: RootState) => state.auth);

    /* ── effects ── */
    useEffect(() => {
        dispatch(fetchProductById(productId));
        return () => { dispatch(clearProduct()); };
    }, [dispatch, productId]);

    useEffect(() => {
        if (product?.variants?.length) setSelectedVariant(product.variants[0]);
    }, [product]);

    /* ── derived values ── */
    const sellingPrice = Number(selectedVariant?.pricing?.selling_price ?? 0);
    const mrp = Number(selectedVariant?.pricing?.mrp ?? 0);
    const discountPct = mrp > 0 && sellingPrice > 0
        ? Math.round(((mrp - sellingPrice) / mrp) * 100) : 0;
    const prepaidPrice = sellingPrice > 0 ? Math.round(sellingPrice * 0.95) : 0;

    const stock = selectedVariant?.inventory?.total_stock ?? 0;
    const inboundStock = selectedVariant?.inventory?.inbound_stock ?? 0;
    const isActive = selectedVariant?.inventory?.is_active === 1;
    const isInStock = stock > 0 || inboundStock > 0 || isActive;
    const isOutOfStock = !isInStock;

    const highlights = [
        product?.screen_size ? `${product.screen_size} display` : null,
        product?.battery_capacity ? `${product.battery_capacity} battery` : null,
        product?.front_camera ? `${product.front_camera} front camera` : null,
        product?.back_camera ? `${product.back_camera} rear camera` : null,
        product?.network_support ? `${product.network_support} network support` : null,
        selectedVariant?.storage ? `${selectedVariant.storage} storage` : null,
    ].filter(Boolean) as string[];

    /* ── handlers ── */
    const handleAddToCart = async () => {
        if (!product || !selectedVariant) { toast.error("Please select a variant first."); return; }

        if (!user?.id) {
            dispatch(addLocalItem({
                id: Date.now(), product_id: product.id, variant_id: selectedVariant.id,
                quantity: 1, item_total: parsePrice(selectedVariant.pricing.selling_price),
                product: { name: product.name, image: selectedVariant.images[0]?.image_url || "" },
                variant: [{ storage: selectedVariant.storage, color: selectedVariant.color,
                    images: selectedVariant.images.map(img => ({ id: img.id, variant_id: img.variant_id, image_url: img.image_url })) }],
                price: { selling_price: selectedVariant.pricing.selling_price }
            }));
            setAddedToCart(true);
            toast.success("Item added to cart!");
            return;
        }

        try {
            setIsCartLoading(true);
            await dispatch(addToCart({ user_id: Number(user.id), product_id: product.id, variant_id: selectedVariant.id, quantity: 1 })).unwrap();
            setAddedToCart(true);
            toast.success("Item added to cart!");
        } catch (err: any) { toast.error(err || "Failed to add to cart"); }
        finally { setIsCartLoading(false); }
    };

    const handleBuyNow = async () => {
        if (!product || !selectedVariant) { toast.error("Please select a variant first."); return; }

        if (!user?.id) {
            dispatch(setRedirectPath("/checkout"));
            dispatch(openLoginModal());
            if (!addedToCart) {
                dispatch(addLocalItem({
                    id: Date.now(), product_id: product.id, variant_id: selectedVariant.id,
                    quantity: 1, item_total: parsePrice(selectedVariant.pricing.selling_price),
                    product: { name: product.name, image: selectedVariant.images[0]?.image_url || "" },
                    variant: [{ storage: selectedVariant.storage, color: selectedVariant.color,
                        images: selectedVariant.images.map(img => ({ id: img.id, variant_id: img.variant_id, image_url: img.image_url })) }],
                    price: { selling_price: selectedVariant.pricing.selling_price }
                }));
                setAddedToCart(true);
            }
            return;
        }

        try {
            setIsCartLoading(true);
            if (!addedToCart) {
                await dispatch(addToCart({ user_id: Number(user.id), product_id: product.id, variant_id: selectedVariant.id, quantity: 1 })).unwrap();
                setAddedToCart(true);
            }
            router.push("/checkout");
        } catch (err: any) { toast.error(err || "Failed to proceed to checkout"); }
        finally { setIsCartLoading(false); }
    };

    const toggleAccordion = (key: TabKey) => {
        setOpenAccordion(openAccordion === key ? null : key);
    };

    const PricingBlock = () => (
        <div className={styles.pricingBlock}>
            {isOutOfStock ? (
                <p className={styles.sidebarOutOfStock}>Price Updating soon</p>
            ) : (
                <>
                    <div className={styles.sidebarPriceRow}>
                        <span className={styles.sidebarSellingPrice}>
                            ₹{sellingPrice.toLocaleString("en-IN")}
                        </span>
                        {mrp > 0 && sellingPrice < mrp && (
                            <>
                                <span className={styles.sidebarMrp}>₹{mrp.toLocaleString("en-IN")}</span>
                                {discountPct > 0 && (
                                    <span className={styles.sidebarDiscount}>{discountPct}% OFF</span>
                                )}
                            </>
                        )}
                    </div>
                    <p className={styles.sidebarTaxNote}>Inclusive of all taxes</p>

                    {prepaidPrice > 0 && (
                        <div className={styles.prepaidBox}>
                            <FiShield className={styles.prepaidIcon} />
                            <div>
                                <span className={styles.prepaidText}>
                                    Buy for as low as ₹{prepaidPrice.toLocaleString("en-IN")}
                                </span>
                                <span className={styles.prepaidNote}>
                                    Get extra ₹1,500 off on prepaid orders
                                </span>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );

    const ActionButtons = () => (
        <div className={styles.actionButtons}>
            <button
                className={styles.sidebarCartBtn}
                onClick={() => isInStock && (addedToCart ? router.push("/cart") : handleAddToCart())}
                disabled={isCartLoading || isOutOfStock}
            >
                <FaShoppingCart />
                {isOutOfStock ? "Out of Stock" : isCartLoading ? "Adding…" : addedToCart ? "Go to Cart" : "Add to Cart"}
            </button>

            <button
                className={styles.sidebarBuyNowBtn}
                onClick={() => isInStock && handleBuyNow()}
                disabled={isCartLoading || isOutOfStock}
            >
                Buy Now
            </button>
        </div>
    );

    const DeliveryBlock = () => (
        <div className={styles.deliveryBlock}>
            <p className={styles.deliveryTitle}>Check Delivery Details</p>
            <div className={styles.pincodeRow}>
                <input
                    className={styles.pincodeInput}
                    type="text"
                    placeholder="Enter Pincode"
                    maxLength={6}
                />
                <button className={styles.pincodeBtn}>Check</button>
            </div>
            <div className={styles.deliveryInfo}>
                <FiCheckCircle className={styles.deliveryCheckIcon} />
                <span>Usually delivered in 2-4 days</span>
            </div>
        </div>
    );

    const ServiceIconsStrip = () => (
        <div className={styles.serviceIconsStrip}>
            <div className={styles.serviceIconItem}>
                <div className={styles.serviceIconWrap}><FiRefreshCw /></div>
                <span className={styles.serviceIconLabel}>7 Days Return</span>
            </div>
            <div className={styles.serviceIconItem}>
                <div className={styles.serviceIconWrap}><FiTruck /></div>
                <span className={styles.serviceIconLabel}>Free Delivery</span>
            </div>
            <div className={styles.serviceIconItem}>
                <div className={styles.serviceIconWrap}><FiCreditCard /></div>
                <span className={styles.serviceIconLabel}>Pay on Delivery</span>
            </div>
        </div>
    );

    /* ── render ── */
    return (
        <div className={styles.pageWrapper}>
            {/* Desktop Breadcrumb */}
            <nav className={styles.breadcrumb}>
                <span className={styles.breadcrumbLink} onClick={() => router.push("/")}>Home</span>
                <FiChevronRight className={styles.breadcrumbSep} />
                <span className={styles.breadcrumbLink}>Mobiles</span>
                <FiChevronRight className={styles.breadcrumbSep} />
                <span className={styles.breadcrumbLink}>{product?.brand?.name || "iPhones"}</span>
                <FiChevronRight className={styles.breadcrumbSep} />
                <span className={styles.breadcrumbActive}>{product?.name || "Product"}</span>
            </nav>

            {/* Main Content Area */}
            <div className={styles.mainLayout}>
                {/* TOP SECTION: Gallery | Info | Sidebar */}
                <div className={styles.topSection}>
                    <div className={styles.galleryColumn}>
                        <ProductGallerytest product={product} selectedVariant={selectedVariant} />
                    </div>

                    <div className={styles.infoColumn}>
                        <ProductInfotest
                            product={product}
                            selectedVariant={selectedVariant}
                            setSelectedVariant={setSelectedVariant}
                        />
                        {/* Mobile flow inserts pricing here */}
                        <div className={styles.mobileOnlyFlow}>
                            <PricingBlock />
                            <ActionButtons />
                            <DeliveryBlock />
                            <ServiceIconsStrip />
                        </div>
                    </div>

                    {/* Desktop Sidebar */}
                    <div className={styles.cartSidebar}>
                        <div className={styles.viewersRow}>
                            <FiEye className={styles.viewerIcon} />
                            <span>61 people are viewing this product</span>
                        </div>
                        <div className={styles.sidebarConditionBadge}>
                            <FiCheckCircle size={13} /> Excellent Condition
                        </div>
                        <PricingBlock />
                        <ActionButtons />
                        <DeliveryBlock />
                    </div>
                </div>

                {/* DESKTOP TABS */}
                <div className={styles.desktopTabs}>
                    <div className={styles.tabsWrapper}>
                        {TABS.map((tab) => (
                            <button
                                key={tab.key}
                                className={`${styles.tabBtn} ${activeTab === tab.key ? styles.activeTab : ""}`}
                                onClick={() => setActiveTab(tab.key)}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                    <div className={styles.tabContent}>
                        {activeTab === "highlights" && (
                             <div className={styles.tabContentGrid}>
                                <div>
                                    <h3 className={styles.highlightsTitle}>Product Highlights</h3>
                                    <ul className={styles.highlightsList}>
                                        {highlights.map((h, i) => (
                                            <li key={i} className={styles.highlightItem}>
                                                <FiCheckCircle className={styles.highlightIcon} /> {h}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className={styles.serviceCardsGrid}>
                                    <div className={styles.serviceCard}>
                                        <div className={styles.serviceCardIconWrap}><FiRefreshCw /></div>
                                        <div className={styles.serviceCardBody}>
                                            <span className={styles.serviceCardTitle}>32+ Quality Checks</span>
                                            <span className={styles.serviceCardDesc}>Tested across 32+ points</span>
                                        </div>
                                    </div>
                                    <div className={styles.serviceCard}>
                                        <div className={styles.serviceCardIconWrap}><FiShield /></div>
                                        <div className={styles.serviceCardBody}>
                                            <span className={styles.serviceCardTitle}>12 Months Warranty</span>
                                            <span className={styles.serviceCardDesc}>Worry-free coverage</span>
                                        </div>
                                    </div>
                                    <div className={styles.serviceCard}>
                                        <div className={styles.serviceCardIconWrap}><FiRepeat /></div>
                                        <div className={styles.serviceCardBody}>
                                            <span className={styles.serviceCardTitle}>7 Days Replacement</span>
                                            <span className={styles.serviceCardDesc}>Not satisfied? Replace within 7 days</span>
                                        </div>
                                    </div>
                                    <div className={styles.serviceCard}>
                                        <div className={styles.serviceCardIconWrap}><FaCreditCard /></div>
                                        <div className={styles.serviceCardBody}>
                                            <span className={styles.serviceCardTitle}>Secure Payment</span>
                                            <span className={styles.serviceCardDesc}>100% Safe and Secure</span>
                                        </div>
                                    </div>
                                </div>
                             </div>
                        )}
                        {activeTab === "specs" && <ProductSpecstest product={product} selectedVariant={selectedVariant} />}
                        {/* ... other tabs ... */}
                    </div>
                </div>

                {/* MOBILE ACCORDIONS */}
                <div className={styles.mobileAccordions}>
                    {TABS.map((tab) => (
                        <div key={tab.key} className={styles.accordionItem}>
                            <div className={styles.accordionHeader} onClick={() => toggleAccordion(tab.key)}>
                                <span>{tab.label}</span>
                                {openAccordion === tab.key ? <FiChevronUp /> : <FiChevronDown />}
                            </div>
                            {openAccordion === tab.key && (
                                <div className={styles.accordionBody}>
                                    {tab.key === "highlights" && (
                                        <ul className={styles.highlightsList}>
                                            {highlights.map((h, i) => (
                                                <li key={i} className={styles.highlightItem}>
                                                    <FiCheckCircle className={styles.highlightIcon} /> {h}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                    {tab.key === "specs" && <ProductSpecstest product={product} selectedVariant={selectedVariant} />}
                                    {tab.key === "box" && <div>Handset, Cable, Guide</div>}
                                    {tab.key === "faq" && <div>FAQ content here</div>}
                                    {tab.key === "reviews" && <div>Customer reviews content</div>}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Sticky Bottom Bar */}
            <div className={styles.mobileBottomBar}>
                <div className={styles.mobilePriceWrap}>
                    <span className={styles.mobilePriceMain}>₹{sellingPrice.toLocaleString("en-IN")}</span>
                    <div className={styles.mobilePriceSubRow}>
                        <span className={styles.mobilePriceMrp}>₹{mrp.toLocaleString("en-IN")}</span>
                        <span className={styles.mobilePriceDiscount}>{discountPct}% OFF</span>
                    </div>
                </div>
                <button
                    className={styles.mobileAddCartBtn}
                    onClick={() => isInStock && (addedToCart ? router.push("/cart") : handleAddToCart())}
                >
                    <FaShoppingCart /> {addedToCart ? "Go to Cart" : "Add to Cart"}
                </button>
            </div>
        </div>
    );
};

export default ProductDetailTestPage;