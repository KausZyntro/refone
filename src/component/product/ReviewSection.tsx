import React from "react";
import { FaStar, FaRegStar } from "react-icons/fa";

const StarRating = ({ rating }) => {
  const totalStars = 5;

  return (
    <div className="comment-stars">
      {[...Array(totalStars)].map((_, i) =>
        i < Math.floor(rating) ? (
          <FaStar key={i} />
        ) : (
          <FaRegStar key={i} />
        )
      )}
    </div>
  );
};

const RatingBar = ({ label, value, width }) => {
  return (
    <div className="comment-rating-row">
      <div className="comment-bar">
        <div
          className="comment-bar-fill"
          style={{ width: width }}
        ></div>
      </div>
      <div className="comment-rating-label">
        <strong>{label}</strong> {value}
      </div>
    </div>
  );
};

const ReviewsSection = () => {
  return (
    <div className="comment-container">

      <h2 className="comment-title">Reviews</h2>

      {/* TOP SUMMARY */}
      <div className="comment-summary">

        <div className="comment-left">
          <h1>4.0</h1>
          <StarRating rating={4} />
          <p>35K ratings</p>
        </div>

        <div className="comment-right">
          <RatingBar label="5.0" value="(14K reviews)" width="80%" />
          <RatingBar label="4.0" value="(6K reviews)" width="55%" />
          <RatingBar label="3.0" value="(4K reviews)" width="45%" />
          <RatingBar label="2.0" value="(800 reviews)" width="30%" />
          <RatingBar label="1.0" value="(9K reviews)" width="60%" />
        </div>

      </div>

      <div className="comment-tags">
        <div className="comment-tag green">4.0 Cleanliness</div>
        <div className="comment-tag green">4.0 Safety & Security</div>
        <div className="comment-tag green">4.0 Staff</div>
        <div className="comment-tag">3.5 Amenities</div>
        <div className="comment-tag">3.0 Location</div>
      </div>

      <div className="comment-review">
        <div className="comment-review-header">
          <div className="comment-review-user">
            <img
            src="https://i.pravatar.cc/100?img=1"
            alt="user"
            className="comment-avatar"
          />
          <div>
            <h4>Alexander Rity</h4>
            <span>4 months ago</span>
          </div>
          </div>

          <div className="comment-review-rating">
            <strong>5.0</strong>
            <FaStar />
          </div>
        </div>

        <p>
          Easy booking, great value! Cozy rooms at a reasonable price.
          Surprisingly quiet with nearby accommodations.
          Highly recommended!
        </p>

        <div className="comment-images">
          <img src="https://picsum.photos/200?1" alt="" />
          <img src="https://picsum.photos/200?2" alt="" />
          <img src="https://picsum.photos/200?3" alt="" />
          <img src="https://picsum.photos/200?4" alt="" />
        </div>
      </div>

      {/* REVIEW 2 */}
      <div className="comment-review">
        <div className="comment-review-header">
          <div className="comment-review-user">
            <img
            src="https://i.pravatar.cc/100?img=5"
            alt="user"
            className="comment-avatar"
          />
          <div>
            <h4>Emma Crieght</h4>
            <span>4 months ago</span>
          </div>
          </div>

          <div className="comment-review-rating">
            <strong>4.0</strong>
            <FaStar />
          </div>
        </div>

        <p>
          Effortless booking, unbeatable affordability!
          Small yet comfortable rooms in the heart of the city.
          Thumbs up!
        </p>
      </div>

      <div className="comment-read-more">Read all reviews ↓</div>

    </div>
  );
};

export default ReviewsSection;