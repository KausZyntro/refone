import styles from "./CustomerReviews.module.css";
import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";
import { useState } from "react";

interface CustomerReviewsProps {
  data: any;
}



export default function CustomerReviews({data}: CustomerReviewsProps) {

    const [selectedImages, setSelectedImages] = useState<string[]>([]);
const [selectedIndex, setSelectedIndex] = useState(0);
const [isOpen, setIsOpen] = useState(false);

const openGallery = (images: string[], index: number) => {
  setSelectedImages(images);
  setSelectedIndex(index);
  setIsOpen(true);
};

const nextImage = () => {
  setSelectedIndex((prev) =>
    prev === selectedImages.length - 1 ? 0 : prev + 1
  );
};

const prevImage = () => {
  setSelectedIndex((prev) =>
    prev === 0 ? selectedImages.length - 1 : prev - 1
  );
};

     if (!data) {
        return (
            <div className={styles.noReviews}>
                <h3>No Reviews Yet</h3>
                <p>
                    Be the first customer to review this product.
                </p>
            </div>
        );
    }

    return (
        <>
        <div className={styles.wrapper}>
            {/* Top Section */}
            <div className={styles.topSection}>
                <div className={styles.ratingSummary}>
                    {/* <h3>Customer Reviews</h3> */}

                    {/* <div className={styles.ratingNumber}>
                         {data?.rating} <FaStar />
                    </div> */}
                 <div className={styles.ratingNumber}>
                    <span>{data?.rating}</span>

                    <div className={styles.ratingStars}>
                        {[1, 2, 3, 4, 5].map((star) => {
                        if (data.rating >= star) {
                            return <FaStar key={star} color="#fbbf24" />;
                        }

                        if (data.rating >= star - 0.5) {
                            return <FaStarHalfAlt key={star} color="#fbbf24" />;
                        }

                        return <FaRegStar key={star} color="#d1d5db" />;
                        })}
                    </div>
                    </div>

                    <p className={styles.reviewCount}>
                        {/* (4 Reviews) */}
                        ({data?.totalReviews} Reviews)
                    </p>

                    {[5,4,3,2,1].map((star) => (
                        <div key={star} className={styles.ratingRow}>
                            <span>{star} Star</span>
                            <div className={styles.progress}>
                                <div
                                    className={styles.progressFill}
                                    style={{
                                        width:
                                            star === 5
                                                ? "78%"
                                                : star === 4
                                                ? "14%"
                                                : star === 3
                                                ? "5%"
                                                : star === 2
                                                ? "2%"
                                                : "1%",
                                    }}
                                />
                            </div>
                        </div>
                    ))}
                </div>

                <div className={styles.mediaSection}>
                    <h4>Photos & Videos from Customers</h4>

                    <div className={styles.mediaGrid}>
                        {/* {[1,2,3,4,5,6].map((item) => (
                            <div
                                key={item}
                                className={styles.mediaItem}
                            />
                        ))} */}
                        {data?.images?.map((img: string, index: number) => (
                            <img
                                key={index}
                                src={img}
                                alt="review"
                                className={styles.mediaItem}
                                onClick={() => openGallery(data.images, index)}
                            />
                            ))}
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className={styles.filterBar}>
                <div className={styles.filters}>
                    <button className={styles.active}>
                        All Reviews
                    </button>

                    <button>Verified Purchases</button>
                    <button>With Media</button>
                </div>

                <select>
                    <option>Newest</option>
                    <option>Highest Rating</option>
                    <option>Lowest Rating</option>
                </select>
            </div>

            {/* Reviews */}
            <div className={styles.reviewList}>
                {data?.reviews?.map((review: any, index: number) => (
                    <div
                        key={review.id}
                        className={styles.reviewCard}
                    >
                        <div className={styles.reviewHeader}>
                            <div>
                                <h4>{review.name}</h4>
                                {/* <small>Verified Buyer</small> */}
                                {review.verified && (
                                    <small>Verified Buyer</small>
                                    )}
                            </div>

                            {/* <div className={styles.stars}>
                                ★★★★★
                            </div> */}
                            <div className={styles.stars}>
                            {"★".repeat(review.rating)}
                            </div>
                        </div>

                        {/* <h5>Excellent condition as promised!</h5> */}
                        <h5>{review.title}</h5>


                        {/* <p>
                            Phone arrived in excellent
                            condition. Battery health was
                            good and shipping was quick.
                        </p> */}
                        <p>{review.text}</p>

                        {/* <div className={styles.reviewImages}>
                            <div className={styles.reviewImage} />
                            <div className={styles.reviewImage} />
                        </div> */}

                        {review.images?.length > 0 && (
                            <div className={styles.reviewImages}>
                                {review.images.map(
                                (img: string, index: number) => (
                                    <img
                                    key={index}
                                    src={img}
                                    alt="review"
                                    className={styles.reviewImage}
                                    onClick={() => openGallery(review.images, index)}
                                    />
                                )
                                )}
                            </div>
                            )}
                    </div>
                ))}
            </div>
        </div>

        {isOpen && (
  <div
    className={styles.lightbox}
    onClick={() => setIsOpen(false)}
  >
    <div
      className={styles.lightboxContent}
      onClick={(e) => e.stopPropagation()}
    >
      <button
        className={styles.closeBtn}
        onClick={() => setIsOpen(false)}
      >
        ×
      </button>

      {selectedImages.length > 1 && (
        <button
          className={styles.prevBtn}
          onClick={prevImage}
        >
          ‹
        </button>
      )}

      <img
        src={selectedImages[selectedIndex]}
        alt="preview"
        className={styles.largeImage}
      />

      {selectedImages.length > 1 && (
        <button
          className={styles.nextBtn}
          onClick={nextImage}
        >
          ›
        </button>
      )}
    </div>
  </div>
)}
</>
    );
}