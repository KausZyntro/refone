import React, { useState } from "react";
import styles from "./WriteReviewModal.module.css";
import { FaStar } from "react-icons/fa";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { feedbackAPI } from "@/services/api";
import { toast } from "react-toastify";

interface WriteReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    productId: number;
    onReviewSubmitted: () => void;
}

export default function WriteReviewModal({ isOpen, onClose, productId, onReviewSubmitted }: WriteReviewModalProps) {
    const { user } = useSelector((state: RootState) => state.auth);
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [message, setMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!user) {
            toast.error("Please login to write a review.");
            return;
        }

        if (rating === 0) {
            toast.error("Please select a rating.");
            return;
        }

        if (!message.trim()) {
            toast.error("Please write a review message.");
            return;
        }

        try {
            setIsSubmitting(true);
            await feedbackAPI.createFeedback({
                product_id: productId,
                user_id: Number(user.id),
                name: user.name || "Customer",
                email: user.email || "customer@example.com",
                rating: rating,
                message: message
            });
            
            toast.success("Review submitted successfully!");
            setRating(0);
            setMessage("");
            onReviewSubmitted();
            onClose();
        } catch (error: any) {
            console.error("Failed to submit review:", error);
            toast.error(error?.response?.data?.message || "Failed to submit review. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h2>Write a Review</h2>
                    <button className={styles.closeBtn} onClick={onClose}>&times;</button>
                </div>
                
                <form onSubmit={handleSubmit} className={styles.reviewForm}>
                    <div className={styles.formGroup}>
                        <label>Your Rating <span className={styles.required}>*</span></label>
                        <div className={styles.starRating}>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    className={`${styles.starBtn} ${(hoverRating || rating) >= star ? styles.starActive : ""}`}
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    onClick={() => setRating(star)}
                                >
                                    <FaStar />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label>Your Review <span className={styles.required}>*</span></label>
                        <textarea
                            className={styles.textareaField}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="What did you like or dislike about this product?"
                            rows={5}
                            required
                        ></textarea>
                    </div>

                    <div className={styles.formActions}>
                        <button type="button" className={styles.cancelBtn} onClick={onClose}>
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            className={styles.submitBtn}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Submitting..." : "Submit Review"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
