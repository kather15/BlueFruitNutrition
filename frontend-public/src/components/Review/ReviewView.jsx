import React from 'react';
import { Star } from 'lucide-react';


const Review = ({ review, onDeleteReview }) => {
  const renderStars = (rating) => (
    [...Array(5)].map((_, i) => (
      <Star key={i} className={`star ${i < rating ? 'filled' : 'empty'}`} size={16} />
    ))
  );

  return (
    <div className="review-card">
      <div className="review-header">
        <div className="reviewer-info">
          <div className="reviewer-avatar">
            {review.idClient?.name?.charAt(0).toUpperCase() || '?'}
          </div>
          <div className="reviewer-details">
            <div className="reviewer-name">
              {review.idClient?.name || 'Usuario'}
            </div>
            <div className="review-date">
              {new Date(review.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>

        <div className="review-actions">
          <div className="review-rating">{renderStars(review.rating)}</div>
          <button
            className="delete-review-btn"
            onClick={() => onDeleteReview(review._id)}
            title="Eliminar reseña"
          >
            Eliminar
          </button>
        </div>
      </div>
      <div className="review-comment">{review.comment}</div>
    </div>
  );
};

export default Review;
