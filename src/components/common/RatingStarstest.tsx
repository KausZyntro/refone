"use client";

import React from "react";
import { FaStar, FaRegStar } from "react-icons/fa";
import styles from "./RatingStarstest.module.css";

interface RatingStarsTestProps {
    rating: number;
    reviewCount: number;
}

const RatingStarstest: React.FC<RatingStarsTestProps> = ({ rating, reviewCount }) => {
    return (
        <div className={styles.ratingContainer}>
            <span className={styles.ratingNumber}>{rating.toFixed(1)}</span>
            <div className={styles.stars}>
                {[1, 2, 3, 4, 5].map((star) =>
                    star <= Math.round(rating) ? (
                        <FaStar key={star} className={styles.starFilled} />
                    ) : (
                        <FaRegStar key={star} className={styles.starEmpty} />
                    )
                )}
            </div>
            <span className={styles.reviewCount}>({reviewCount.toLocaleString("en-IN")} Ratings)</span>
        </div>
    );
};

export default RatingStarstest;
