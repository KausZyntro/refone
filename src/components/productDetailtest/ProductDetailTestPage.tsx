"use client";
import React, { useEffect, useState } from "react";
import ProductGallerytest from "@/components/productDetailtest/ProductGallerytest";
import ProductInfotest from "@/components/productDetailtest/ProductInfotest";
import ProductSpecstest from "@/components/productDetailtest/ProductSpecstest";
import { FairColorVariant, ProductTest, VariantTest } from "@/types/producttest";
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
import CustomerReviews from "./CustomerReviews";
import { productReviews } from "@/data/productReviews";
import { Swiper, SwiperSlide } from "swiper/react";
import ProductCard from "@/app/allProduct/components/ProductCard";
import { FiCheck, FiGift } from "react-icons/fi";
// import ProductCard from "../ui/ProductCard";

interface ProductDetailTestPageProps {
    productId: string;
}


type TabKey = "highlights" | "specs" | "box" | "faq" | "reviews";


const TABS: { key: TabKey; label: string }[] = [
    { key: "highlights", label: "Product Details" },
    { key: "specs", label: "Specifications" },
    // { key: "box", label: "What's in the Box" },
    // { key: "faq", label: "FAQs" },
    // { key: "reviews", label: "Customer Reviews" },
];

const ProductDetailTestPage: React.FC<ProductDetailTestPageProps> = ({ productId }) => {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();

    const reviewData = productReviews[Number(productId)] || null;

    /* ── state ── */
    const [selectedVariant, setSelectedVariant] = React.useState<VariantTest | null>(null);
    const [activeTab, setActiveTab] = useState<TabKey>("highlights");
    const [openAccordion, setOpenAccordion] = useState<TabKey | null>(null);
    const [addedToCart, setAddedToCart] = useState(false);
    const [isCartLoading, setIsCartLoading] = useState(false);
    const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
    const [relatedLoading, setRelatedLoading] = useState(false);
    const [selectedCondition, setSelectedCondition] = useState<"Fair" | "Good" | "Superb">("Superb");

    /* ── redux ── */
    const { product, isLoading } = useSelector((state: RootState) => state.product);
    const { user } = useSelector((state: RootState) => state.auth);

    /* ── effects ── */
    useEffect(() => {
        dispatch(fetchProductById(productId));
        return () => { dispatch(clearProduct()); };
    }, [dispatch, productId]);

    useEffect(() => {
        if (product?.variants?.length) {
            const inStockVariant = product.variants.find((v: VariantTest) => {
                const stock = v?.inventory?.total_stock ?? 0;
                const inboundStock = v?.inventory?.inbound_stock ?? 0;
                const isActive = v?.inventory?.is_active === 1;
                return stock > 0 || inboundStock > 0 || isActive;
            });
            setSelectedVariant(inStockVariant || product.variants[0]);
        }
    }, [product]);
    useEffect(() => {
    if (product?.name) {
        getRelatedProducts();
    }
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
    const fairProductPrice = selectedVariant?.pricing?.fair_price ?? 0;
    const goodProductPrice = selectedVariant?.pricing?.good_price ?? 0;
    console.log(fairProductPrice)

    const highlights = [
        product?.screen_size ? `${product.screen_size} display` : null,
        product?.battery_capacity ? `${product.battery_capacity} battery` : null,
        product?.front_camera ? `${product.front_camera} front camera` : null,
        product?.back_camera ? `${product.back_camera} rear camera` : null,
        product?.network_support ? `${product.network_support} network support` : null,
        selectedVariant?.storage ? `${selectedVariant.storage} storage` : null,
    ].filter(Boolean) as string[];

    /* ── Derived logic for Storage and Color ── */
    const selectedStorage = selectedVariant?.storage;

    const isVariantInStock = (v: VariantTest) => {
        const s = v?.inventory?.total_stock ?? 0;
        const i = v?.inventory?.inbound_stock ?? 0;
        const a = v?.inventory?.is_active === 1;
        return s > 0 || i > 0 || a;
    };

    const storageGroups = (product?.variants ?? []).reduce(
        (acc: { storage: string; rep: VariantTest; hasStock: boolean }[], v: VariantTest) => {
            const existing = acc.find(g => g.storage === v.storage);
            const inStock = isVariantInStock(v);
            if (!existing) {
                acc.push({ storage: v.storage, rep: v, hasStock: inStock });
            } else if (inStock && !existing.hasStock) {
                existing.hasStock = true;
                existing.rep = v;
            }
            return acc;
        },
        [] as { storage: string; rep: VariantTest; hasStock: boolean }[]
    );



    const colorVariants = (product?.variants ?? []).filter((v: VariantTest) => v.storage === selectedStorage);

    const minPriceForStorage = (storage: string) => {
        const variantsForStorage = (product?.variants ?? []).filter((v: VariantTest) => v.storage === storage);
        const prices = variantsForStorage
            .map((v: VariantTest) => Number(v?.pricing?.selling_price ?? 0))
            .filter(p => p > 0);
        return prices.length ? Math.min(...prices) : 0;
    };






    /* ── handlers ── */
    const handleAddToCart = async () => {
        if (!product || !selectedVariant) { toast.error("Please select a variant first."); return; }

        if (!user?.id) {
            dispatch(addLocalItem({
                id: Date.now(), product_id: product.id, variant_id: selectedVariant.id,
                quantity: 1, item_total: parsePrice(selectedVariant.pricing.selling_price),
                product: { name: product.name, image: selectedVariant.images[0]?.image_url || "" },
                variant: [{
                    storage: selectedVariant.storage, color: selectedVariant.color,
                    images: selectedVariant.images.map(img => ({ id: img.id, variant_id: img.variant_id, image_url: img.image_url }))
                }],
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
                    variant: [{
                        storage: selectedVariant.storage, color: selectedVariant.color,
                        images: selectedVariant.images.map(img => ({ id: img.id, variant_id: img.variant_id, image_url: img.image_url }))
                    }],
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

//     const getRelatedProducts = async () => {
//     if (!product?.name) return;

//     try {
//         setRelatedLoading(true);

//         const response = await productAPI.getRelatedProducts(product.name);
//         // console.log("Response:", response);
// // console.log("Response.data:", response?.success);

//         if (response.success) {
//             const filteredProducts = response.pdata.filter(
//                 (item: any) => item.id !== product.id
//             );

//             setRelatedProducts(filteredProducts);
//         }
//     } catch (error) {
//         console.error("Related products error:", error);
//     } finally {
//         setRelatedLoading(false);
//     }
// };

   const getRelatedProducts = async () => {
    if (!product?.name) return;

    try {
        setRelatedLoading(true);

        const response = await productAPI.getRelatedProducts(product.name);

        if (response.success) {
            const relatedProducts = response.pdata
                .filter((item: any) => item.id !== product.id)
                .map((item: any) => ({
                    ...item,
                    variants: item.variants.length ? [item.variants[0]] : [],
                }));

            setRelatedProducts(relatedProducts);
        }
    } catch (error) {
        console.error("Related products error:", error);
    } finally {
        setRelatedLoading(false);
    }
};

    const toggleAccordion = (key: TabKey) => {
        setOpenAccordion(openAccordion === key ? null : key);
    };

    const PricingBlock = () => (
        <div className={styles.pricingBlock}>
            {isLoading ? (
                <>
                    <div className={`${styles.skeleton} ${styles.priceSkeleton}`} />
                    <div className={`${styles.skeleton} ${styles.prepaidSkeleton}`} />
                </>
            ) : isOutOfStock ? (
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

                    {/* {prepaidPrice > 0 && (
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
                    )} */}
                </>
            )}
        </div>
    );

    const ActionButtons = () => {
        if (selectedCondition === "Fair" || selectedCondition === "Good") {
            return null;
        }

        return (
            <div className={styles.actionButtons}>
                <button
                    className={styles.sidebarBuyNowBtn}
                    onClick={() => isInStock && handleBuyNow()}
                    disabled={isLoading || isCartLoading || isOutOfStock}
                >
                    {isLoading ? "..." : "Buy Now"}
                </button>

                <button
                    className={styles.sidebarCartBtn}
                    onClick={() => isInStock && (addedToCart ? router.push("/cart") : handleAddToCart())}
                    disabled={isLoading || isCartLoading || isOutOfStock}
                >
                    <FaShoppingCart />
                    {isLoading ? "Loading..." : isOutOfStock ? "Out of Stock" : isCartLoading ? "Adding…" : addedToCart ? "Go to Cart" : "Add to Cart"}
                </button>
            </div>
        );
    };

    // const DeliveryBlock = () => (
    //     <div className={styles.deliveryBlock}>
    //         <p className={styles.deliveryTitle}>Check Delivery Details</p>
    //         <div className={styles.pincodeRow}>
    //             <input
    //                 className={styles.pincodeInput}
    //                 type="text"
    //                 placeholder="Enter Pincode"
    //                 maxLength={6}
    //             />
    //             <button className={styles.pincodeBtn}>Check</button>
    //         </div>
    //         <div className={styles.deliveryInfo}>
    //             <FiCheckCircle className={styles.deliveryCheckIcon} />
    //             <span>Usually delivered in 2-4 days</span>
    //         </div>
    //     </div>
    // );

    const ServiceIconsStrip = () => (
        <div className={styles.serviceIconsStrip}>
            <div className={styles.serviceIconItem}>
                <div className={styles.serviceIconWrap}><FiRefreshCw /></div>
                <span className={styles.serviceIconLabel}>7 Days Replacement</span>
            </div>
            <div className={styles.serviceIconItem}>
                <div className={styles.serviceIconWrap}><FiTruck /></div>
                <span className={styles.serviceIconLabel}>Fast Delivery</span>
            </div>
            {/* <div className={styles.serviceIconItem}>
                <div className={styles.serviceIconWrap}><FiCreditCard /></div>
                <span className={styles.serviceIconLabel}>Pay on Delivery</span>
            </div> */}
        </div>
    );


    const GradeExplanation = () => (
        <div className={styles.gradeExplanationSection}>
            <h2 className={styles.gradeTitle}>
                <span className={styles.gradeTitleIcon}>⭐</span> Grade Explanation <span className={styles.gradeTitleIcon}>🍃</span>
            </h2>
            <div className={styles.gradeCardsContainer}>
                {/* Fair Card */}
                <div className={`${styles.gradeCard} ${styles.gradeCardFair}`}>
                    <div className={styles.gradeCardContent}>
                        <div className={styles.gradeCardHeader}>
                            <div className={styles.gradeCardTitleWrap}>
                                <FiShield className={styles.gradeCardIcon} />
                                <h3 className={styles.gradeCardTitle}>Fair</h3>
                            </div>
                        </div>
                        <p className={styles.gradeCardSubtitle}>Visible scratches and signs of use.</p>
                        <ul className={styles.gradeCardList}>
                            <li><FiCheck className={styles.gradeCardListIcon} /> May have scratches on body & screen</li>
                            <li><FiCheck className={styles.gradeCardListIcon} /> Perfect working condition</li>
                            <li><FiCheck className={styles.gradeCardListIcon} /> Battery health {'>'} 80%</li>
                        </ul>
                    </div>
                    <img src="/images/c1.png" alt="Fair Phone" className={styles.gradeCardImage} />
                </div>

                {/* Good Card */}
                <div className={`${styles.gradeCard} ${styles.gradeCardGood}`}>
                    <div className={styles.gradeCardContent}>
                        <div className={styles.gradeCardHeader}>
                            <div className={styles.gradeCardTitleWrap}>
                                <FiShield className={styles.gradeCardIcon} />
                                <h3 className={styles.gradeCardTitle}>Good</h3>
                            </div>
                        </div>
                        <p className={styles.gradeCardSubtitle}>Minor signs of use.</p>
                        <ul className={styles.gradeCardList}>
                            <li><FiCheck className={styles.gradeCardListIcon} /> Light scratches on body</li>
                            <li><FiCheck className={styles.gradeCardListIcon} /> Perfect working condition</li>
                            <li><FiCheck className={styles.gradeCardListIcon} /> Battery health {'>'} 85%</li>
                        </ul>
                    </div>
                    <img src="/images/c2.png" alt="Good Phone" className={styles.gradeCardImage} />
                </div>

                {/* Superb Card */}
                <div className={`${styles.gradeCard} ${styles.gradeCardSuperb}`}>
                    <div className={styles.gradeCardContent}>
                        <div className={styles.gradeCardHeader}>
                            <div className={styles.gradeCardTitleWrap}>
                                <FiShield className={styles.gradeCardIcon} />
                                <h3 className={styles.gradeCardTitle}>Superb</h3>
                            </div>
                            <span className={styles.gradeCardBadge}>Recommended</span>
                        </div>
                        <p className={styles.gradeCardSubtitle}>Looks almost new.</p>
                        <ul className={styles.gradeCardList}>
                            <li><FiCheck className={styles.gradeCardListIcon} /> No visible scratches from 12 inches</li>
                            <li><FiCheck className={styles.gradeCardListIcon} /> Perfect working condition</li>
                            <li><FiCheck className={styles.gradeCardListIcon} /> Battery health {'>'} 90%</li>
                        </ul>
                    </div>
                    <img src="/images/c3.png" alt="Superb Phone" className={styles.gradeCardImage} />
                </div>
            </div>
        </div>
    );

    const WhatsInTheBox = () => {
        const items = [
            { name: "iPhone 14 Pro", img: "/images/iphone-d.png" },
            { name: "USB-C to Lightning Cable", img: "/images/lightingCable.png" },
            { name: "SIM Ejector Tool", img: "/images/simInjector.png" },
            { name: "Eco Friendly Packaging", img: "/images/w1.png" },
            { name: "Welcome Guide", img: "/images/w2.png" },
        ];

        return (
            <div className={styles.whatsInBoxSection}>
                <div className={styles.whatsInBoxMain}>
                    <h2 className={styles.gradeTitle}>
                        <span className={styles.gradeTitleIcon}>🎁</span> What&apos;s in the Box
                    </h2>
                    <div className={styles.whatsInBoxItems}>
                        {items.map((item, idx) => (
                            <div key={idx} className={styles.boxItem}>
                                <div className={styles.boxItemImageWrap}>
                                    <img src={item.img} alt={item.name} className={styles.boxItemImage} />
                                </div>
                                <span className={styles.boxItemName}>{item.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className={styles.ecoPromiseCard}>
                    <div className={styles.ecoPromiseTop}>
                        <span className={styles.ecoPromiseIcon}>🍃</span>
                        <h3 className={styles.ecoPromiseTitle}>Our <span>Eco</span> Promise</h3>
                        <p className={styles.ecoPromiseDesc}>Biodegradable packaging<br/>for a greener tomorrow.</p>
                    </div>
                    <img src="/images/globe.png" alt="Eco Promise Globe" className={styles.ecoPromiseImg} />
                </div>
            </div>
        );
    };

    const FAQSectionLocal = () => {
        const [openFaq, setOpenFaq] = useState<number | null>(null);

        const faqs = [
            {
                q: "Is the iPhone 14 Pro original?",
                a: "Yes, all our devices are 100% original and go through rigorous 52+ quality checks."
            },
            {
                q: "What is the battery health in refurbished devices?",
                a: "Our devices have a minimum battery health of 90% to ensure optimal performance."
            },
            {
                q: "Will I get Apple warranty?",
                a: "You will get a comprehensive warranty from Refone for 12 months."
            },
            {
                q: "What is your return policy?",
                a: "We offer a 7-day hassle-free replacement policy if you are not satisfied."
            },
            {
                q: "Is EMI available?",
                a: "No, EMI is coming soon."
            },
            {
                q: "How long does delivery take?",
                a: "Standard delivery takes 2-4 business days depending on your location."
            },
            {
                q: "Can I exchange my old device?",
                a: "Yes, you can exchange your device."
            },
            {
                q: "What if I receive a defective product?",
                a: "In the rare case of a defect, our 7-day replacement guarantee has you covered."
            }
        ];

        return (
            <div className={styles.faqSectionWrapper}>
                <h2 className={styles.gradeTitle}>
                    <span className={styles.gradeTitleIcon}>❔</span> Frequently Asked Questions
                </h2>
                <div className={styles.faqGrid}>
                    {faqs.map((faq, idx) => (
                        <div key={idx} className={styles.faqItem} onClick={() => setOpenFaq(openFaq === idx ? null : idx)} style={{ cursor: "pointer", flexDirection: "column", alignItems: "flex-start" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                                <span className={styles.faqQuestionText}>{faq.q}</span>
                                {openFaq === idx ? <FiChevronUp className={styles.faqChevron} /> : <FiChevronDown className={styles.faqChevron} />}
                            </div>
                            {openFaq === idx && (
                                <div style={{ marginTop: "12px", fontSize: "14px", color: "#666", lineHeight: "1.5" }}>
                                    {faq.a}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                
                <div className={styles.faqFooter}>
                    <button className={styles.viewAllFaqsBtn}>View All FAQs &rarr;</button>
                </div>

                {/* <div className={styles.mobileCareBanner}>
                    <div className={styles.careIconWrap}>
                        <FiShield className={styles.careIcon} />
                    </div>
                    <div className={styles.careTextWrap}>
                        <h4>Refone Care+</h4>
                        <p>Extended warranty & damage protection.</p>
                        <span className={styles.careLearnMore}>Learn More &rarr;</span>
                    </div>
                </div> */}
            </div>
        );
    };

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
                            {/* <DeliveryBlock /> */}
                            <ServiceIconsStrip />
                        </div>
                    </div>

                    {/* Desktop Sidebar */}
                    <div className={styles.cartSidebar}>
                        {/* <div className={styles.viewersRow}>
                            <FiEye className={styles.viewerIcon} />
                            <span>61 people are viewing this product</span>
                        </div> */}
                        
                        <div className={styles.conditionSectionWrapper}>
                            <div className={styles.conditionSectionTitle}>Choose Condition</div>
                            
                            {/* Fair Condition */}
                            <div 
                                className={`${styles.conditionOption} ${selectedCondition === "Fair" ? styles.conditionOptionActive : ""}`}
                                onClick={() => setSelectedCondition("Fair")}
                            >
                                <FiShield className={styles.Fair} />
                                <div className={styles.conditionDetails}>
                                    <div className={styles.conditionNameRow}>
                                        <span className={styles.conditionNameFair}>Fair</span>
                                    </div>
                                    <div className={styles.conditionPriceFair}>₹{Number(fairProductPrice).toLocaleString("en-IN")}</div>
                                    <div className={styles.conditionDesc}>Visible signs of use.</div>
                                    <div style={{ marginTop: '8px' }}>
                                        <span className={styles.stockBadgeOutOfStock}>Out of Stock</span>
                                    </div>
                                </div>
                            </div>

                            {/* Good Condition */}
                            <div 
                                className={`${styles.conditionOption} ${selectedCondition === "Good" ? styles.conditionOptionActive : ""}`}
                                onClick={() => setSelectedCondition("Good")}
                            >
                                <FiShield className={styles.conditionIconGood} />
                                <div className={styles.conditionDetails}>
                                    <div className={styles.conditionNameRow}>
                                        <span className={styles.conditionNameGood}>Good</span>
                                    </div>
                                    <div className={styles.conditionPriceGood}>₹{Number(goodProductPrice).toLocaleString("en-IN")}</div>
                                    <div className={styles.conditionDesc}>Minor signs of use.</div>
                                    <div style={{ marginTop: '8px' }}>
                                        <span className={styles.stockBadgeOutOfStock}>Out of Stock</span>
                                    </div>
                                </div>
                            </div>

                            {/* Superb Condition */}
                            <div 
                                className={`${styles.conditionOption} ${selectedCondition === "Superb" ? styles.conditionOptionActive : ""}`}
                                onClick={() => setSelectedCondition("Superb")}
                            >
                                <FiShield className={styles.conditionIcon} />
                                <div className={styles.conditionDetails}>
                                    <div className={styles.conditionNameRow}>
                                        <span className={styles.conditionName}>Superb</span>
                                        <span className={styles.conditionRecommended}>Recommended</span>
                                    </div>
                                    <div className={styles.conditionPrice}>₹{sellingPrice.toLocaleString("en-IN")}</div>
                                    <div className={styles.conditionDesc}>Like new. Minimal to no signs.</div>
                                    <div style={{ marginTop: '8px' }}>
                                        <span className={styles.stockBadgeInStock}>In Stock</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {selectedCondition === "Superb" && (
                            <>
                                {/* Select Storage */}
                                {storageGroups.length > 0 && (
                                    <>
                                        <div className={styles.sidebarSectionTitle}>Select Storage</div>
                                        <div className={styles.sidebarStoragePills}>
                                            {storageGroups.map(({ storage, rep, hasStock }) => {
                                                const price = minPriceForStorage(storage);
                                                const isSelected = selectedStorage === storage;
                                                return (
                                                    <button
                                                        key={storage}
                                                        className={`${styles.sidebarStoragePill} ${isSelected ? styles.sidebarStoragePillActive : ""} ${!hasStock ? styles.outOfStock : ""}`}
                                                        onClick={() => hasStock && setSelectedVariant(rep)}
                                                        disabled={!hasStock}
                                                    >
                                                        <span className={styles.sidebarPillStorage}>{storage}</span>
                                                        {price > 0 && (
                                                            <span className={styles.sidebarPillPrice}>₹{price.toLocaleString("en-IN")}</span>
                                                        )}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </>
                                )}

                                {/* Select Color */}
                                {colorVariants.length > 0 && (
                                    <>
                                        <div className={styles.sidebarSectionTitle}>Select Color</div>
                                        <div className={styles.sidebarColorOptions}>
                                            {colorVariants.map((v: VariantTest) => {
                                                const inStock = isVariantInStock(v);
                                                return (
                                                    <button
                                                        key={v.id}
                                                        className={`${styles.sidebarColorSwatch} ${selectedVariant?.id === v.id ? styles.sidebarColorSwatchActive : ""} ${!inStock ? styles.outOfStock : ""}`}
                                                        onClick={() => inStock && setSelectedVariant(v)}
                                                        title={inStock ? v.color : `${v.color} (Out of Stock)`}
                                                        disabled={!inStock}
                                                    >
                                                        <div className={styles.sidebarColorCircleWrap}>
                                                            <span
                                                                className={styles.sidebarColorCircle}
                                                                style={{ backgroundColor: v.color_code || "#ccc" }}
                                                            />
                                                        </div>
                                                        <span className={styles.sidebarColorLabel}>{v.color}</span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </>
                                )}
                            </>
                        )}

                        <ActionButtons />
                    </div>
                </div>

                {/* tabs */}

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
                                            <span className={styles.serviceCardTitle}>52+ Quality Checks</span>
                                            <span className={styles.serviceCardDesc}>Tested across 52+ points</span>
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
                        {activeTab === "reviews" && <CustomerReviews data={reviewData}/>}
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
                                     {tab.key === "reviews" && (
                                        <CustomerReviews data={reviewData} />
                                        )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* RELATED PRODUCTS */}
                {relatedProducts && relatedProducts.length > 0 && (
                    <div className={styles.relatedProductsSection}>
                        <h2 className={styles.relatedTitle}>Product you may like</h2>

                        <Swiper
                            slidesPerView={2}
                            spaceBetween={16}
                            breakpoints={{
                                768: {
                                    slidesPerView: 3,
                                },
                                1024: {
                                    slidesPerView: 4,
                                    spaceBetween: 16,
                                },
                                1280: {
                                    slidesPerView: 5,
                                    spaceBetween: 18,
                                },
                                1440: {
                                    slidesPerView: 6,
                                    spaceBetween: 20,
                                },
                            }}
                        >
                            {relatedProducts.map((product) => (
                                <SwiperSlide  key={`${product.id}-${product.variants[0]?.id || 0}`}>
                                    <ProductCard product={product} />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                )}

                {/* GRADE EXPLANATION */}
                <GradeExplanation />

                {/* WHATS IN THE BOX */}
                <WhatsInTheBox />

                {/* FAQ SECTION */}
                <FAQSectionLocal />

                {/* DESKTOP TABS */}
              
            </div>


        </div>
    );
};

export default ProductDetailTestPage;