import React, { useState, useEffect } from "react";


const exampleReviews = [
  {
    idCustomer: { name: "Ana García" },
    assessment: 4,
    comment: "Muy buen producto, me encantó el sabor y la calidad."
  },
  {
    idCustomer: { name: "Carlos Pérez" },
    assessment: 5,
    comment: "Excelente! Lo recomiendo al 100%."
  },
  {
    idCustomer: { name: "Laura Martínez" },
    assessment: 3,
    comment: "Está bien, pero esperaba un poco más de intensidad en el sabor."
  }
];

const Reviews = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    // Simula carga con datos de ejemplo
    setReviews(exampleReviews);
  }, []);

  return (
    <div className="reviews-container">
      {reviews.length === 0 ? (
        <p className="no-reviews">No reviews yet.</p>
      ) : (
        reviews.map((review, index) => (
          <div key={index} className="review-box">
            <p className="user-name">{review.idCustomer?.name || "Unknown user"}</p>
            <p className="stars">
              {"★".repeat(review.assessment)}{"☆".repeat(5 - review.assessment)}
            </p>
            <p className="comment">{review.comment}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default Reviews;
