import styles from "./CustomerReviews.module.css";
import { FaRegStar, FaStar, FaStarHalfAlt, FaCheckCircle } from "react-icons/fa";
import { useState, useEffect } from "react";
import { feedbackAPI } from "@/services/api";

interface CustomerReviewsProps {
  productId: number;
  initialData?: any;
}

export default function CustomerReviews({ productId, initialData }: CustomerReviewsProps) {
    const [reviews, setReviews] = useState<any[]>(initialData?.reviews || []);
    const [stats, setStats] = useState<any>({
        rating: initialData?.rating || 0,
        totalReviews: initialData?.totalReviews || 0,
        distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    });
    const [loading, setLoading] = useState(!initialData);
    const [selectedImages, setSelectedImages] = useState<string[]>([]);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [isGalleryOpen, setIsGalleryOpen] = useState(false);
    const [visibleReviewsCount, setVisibleReviewsCount] = useState(3);

    const fetchReviews = async () => {
        try {
            setLoading(true);
            const response = await feedbackAPI.getFeedbacks(`product_id=${productId}&per_page=100`);
            const fetchedReviews = response.data?.data || [];
            
            // Calculate stats
            let totalRating = 0;
            let dist: any = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
            fetchedReviews.forEach((r: any) => {
                totalRating += r.rating;
                dist[r.rating] = (dist[r.rating] || 0) + 1;
            });

            const avgRating = fetchedReviews.length > 0 ? (totalRating / fetchedReviews.length).toFixed(1) : 0;
            
            setReviews(fetchedReviews);
            setStats({
                rating: avgRating,
                totalReviews: fetchedReviews.length,
                distribution: dist
            });
        } catch (error) {
            console.error("Failed to fetch reviews:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!initialData && productId) {
            fetchReviews();
        }
    }, [productId]);

    const openGallery = (images: string[], index: number) => {
        setSelectedImages(images);
        setSelectedIndex(index);
        setIsGalleryOpen(true);
    };

    const nextImage = () => {
        setSelectedIndex((prev) => prev === selectedImages.length - 1 ? 0 : prev + 1);
    };

    const prevImage = () => {
        setSelectedIndex((prev) => prev === 0 ? selectedImages.length - 1 : prev - 1);
    };

    // Mock tags for "Customers Love"
    const customerLoveTags = [
        { name: "Camera Quality", count: 482 },
        { name: "Battery Backup", count: 312 },
        { name: "Value for Money", count: 298 },
        { name: "Display Quality", count: 185 },
    ];

    if (loading) {
        return <div className={styles.loading}>Loading reviews...</div>;
    }

    return (
        <>
            <div className={styles.wrapper}>
                
                {/* Header with Title and Write Review Button */}
                <div className={styles.header}>
                    <h2>Customer Reviews</h2>
                </div>

                {/* Top Section Layout (User Reviews + Customers Love) */}
                <div className={styles.topGrid}>
                    
                    {/* Left Side: User Reviews */}
                    <div className={styles.userReviewsSection}>
                        <div className={styles.userReviewsHeader}>
                            <h3>User Reviews</h3>
                            {/* <a href="#" className={styles.viewAllLink}>View all reviews</a> */}
                        </div>
                        
                        <div className={styles.ratingSummaryRow}>
                            <div className={styles.ratingMain}>
                                <div className={styles.ratingBigNumber}>{stats.rating}</div>
                                <div className={styles.ratingStars}>
                                    {[1, 2, 3, 4, 5].map((star) => {
                                        if (stats.rating >= star) return <FaStar key={star} color="#fbbf24" />;
                                        if (stats.rating >= star - 0.5) return <FaStarHalfAlt key={star} color="#fbbf24" />;
                                        return <FaRegStar key={star} color="#d1d5db" />;
                                    })}
                                </div>
                                <p className={styles.ratingBasedOn}>Based on<br/>{stats.totalReviews} reviews</p>
                            </div>

                            <div className={styles.ratingBars}>
                                {[5, 4, 3, 2, 1].map((star) => {
                                    const count = stats.distribution[star] || 0;
                                    const percent = stats.totalReviews > 0 ? Math.round((count / stats.totalReviews) * 100) : 0;
                                    
                                    return (
                                        <div key={star} className={styles.barRow}>
                                            <span className={styles.barLabel}>{star} <FaStar className={styles.smallStar}/></span>
                                            <div className={styles.progressBar}>
                                                <div
                                                    className={styles.progressFill}
                                                    style={{ width: `${percent}%` }}
                                                />
                                            </div>
                                            <span className={styles.barPercent}>{percent}%</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Customers Love */}
                    <div className={styles.customersLoveSection}>
                        <h3>Customers Love</h3>
                        <div className={styles.tagsContainer}>
                            {customerLoveTags.map((tag, idx) => (
                                <span key={idx} className={styles.loveTag}>
                                    {tag.name} ({tag.count})
                                </span>
                            ))}
                        </div>

                        {/* Featured Review */}
                        {reviews.length > 0 && (
                            <div className={styles.featuredReview}>
                                <div className={styles.featuredBadge}>
                                    {reviews[0].rating} <FaStar />
                                </div>
                                <div className={styles.featuredContent}>
                                    <p className={styles.featuredText}>"{reviews[0].message || reviews[0].text || "Great phone in excellent condition. Totally worth it!"}"</p>
                                    <div className={styles.featuredFooter}>
                                        <span className={styles.featuredAuthor}>- {reviews[0].name || "Customer"}</span>
                                        <span className={styles.verifiedBuyer}><FaCheckCircle /> Verified Buyer</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Review List */}
                <div className={styles.reviewList}>
                    {reviews.length === 0 ? (
                        <div className={styles.noReviews}>
                            <p>No reviews yet. Be the first to review this product!</p>
                        </div>
                    ) : (
                        <>
                            {reviews.slice(0, visibleReviewsCount).map((review: any) => (
                                <div key={review.id} className={styles.reviewCard}>
                                    <div className={styles.reviewHeader}>
                                        <div>
                                            <h4>{review.name || "Customer"}</h4>
                                            {/* Assuming all fetched are verified or API provides verified flag */}
                                            <small className={styles.verifiedText}><FaCheckCircle /> Verified Buyer</small>
                                        </div>
                                        <div className={styles.stars}>
                                            {"★".repeat(review.rating)}
                                            <span style={{ color: '#d1d5db' }}>{"★".repeat(5 - review.rating)}</span>
                                        </div>
                                    </div>
                                    
                                    {review.title && <h5>{review.title}</h5>}
                                    <p className={styles.reviewBody}>{review.message || review.text}</p>
                                    
                                    {review.images?.length > 0 && (
                                        <div className={styles.reviewImages}>
                                            {review.images.map((img: string, index: number) => (
                                                <img
                                                    key={index}
                                                    src={img}
                                                    alt="review"
                                                    className={styles.reviewImage}
                                                    onClick={() => openGallery(review.images, index)}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                            {visibleReviewsCount < reviews.length && (
                                <button 
                                    className={styles.viewMoreBtn} 
                                    onClick={() => setVisibleReviewsCount(prev => prev + 3)}
                                >
                                    View More Reviews
                                </button>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Gallery Lightbox */}
            {isGalleryOpen && (
                <div className={styles.lightbox} onClick={() => setIsGalleryOpen(false)}>
                    <div className={styles.lightboxContent} onClick={(e) => e.stopPropagation()}>
                        <button className={styles.closeBtn} onClick={() => setIsGalleryOpen(false)}>×</button>
                        {selectedImages.length > 1 && <button className={styles.prevBtn} onClick={prevImage}>‹</button>}
                        <img src={selectedImages[selectedIndex]} alt="preview" className={styles.largeImage} />
                        {selectedImages.length > 1 && <button className={styles.nextBtn} onClick={nextImage}>›</button>}
                    </div>
                </div>
            )}
        </>
    );
}