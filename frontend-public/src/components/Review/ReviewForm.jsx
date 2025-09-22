import React, { useState } from 'react';
import { Star } from 'lucide-react';
import toast from 'react-hot-toast';

const ReviewForm = ({ productId, loadReviews }) => {
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: '',
  });
  const [showReviewForm, setShowReviewForm] = useState(false);

  const handleRatingChange = (rating) => {
    setNewReview({ ...newReview, rating });
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!newReview.comment.trim()) {
      toast('Por favor escribe un comentario.', { icon: '⚠️' });
      return;
    }

    const reviewToSend = {
      comment: newReview.comment,
      rating: newReview.rating,
      idProduct: productId,
    };

    try {
      const response = await fetch(`http://localhost:4000/api/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewToSend),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('¡Reseña agregada exitosamente!');
        setNewReview({ rating: 5, comment: '' });
        setShowReviewForm(false);
        loadReviews();
      } else {
        toast.error(data.message || 'Error al guardar reseña');
      }
    } catch (err) {
      console.error('Error:', err);
      toast.error('Error al enviar la reseña');
    }
  };

  return (
    <div className="review-form-container">
      <button
        className="toggle-review-form-btn"
        onClick={() => setShowReviewForm(!showReviewForm)}
      >
        {showReviewForm ? 'Cancelar' : 'Agregar Reseña'}
      </button>

      {showReviewForm && (
        <form onSubmit={handleSubmitReview} className="review-form">
          {/* Calificación de estrellas */}
          <div className="rating-section">
            <label htmlFor="rating">Calificación</label>
            <div className="stars-container">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={24}
                  className={`star ${i < newReview.rating ? 'filled' : 'empty'}`}
                  onClick={() => handleRatingChange(i + 1)}
                />
              ))}
            </div>
          </div>

          {/* Comentario */}
          <div className="comment-section">
            <label htmlFor="comment">Comentario</label>
            <textarea
              id="comment"
              value={newReview.comment}
              onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
              placeholder="Escribe tu reseña aquí..."
              rows="4"
            />
          </div>

          {/* Botones */}
          <div className="review-form-buttons">
            <button type="submit" className="submit-btn">Enviar</button>
            <button type="button" className="cancel-btn" onClick={() => setShowReviewForm(false)}>
              Cancelar
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ReviewForm;
