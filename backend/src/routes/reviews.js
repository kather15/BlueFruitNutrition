import express from "express";
import reviewController from "../controllers/CtrlReview.js";

const router = express.Router();

// Obtener todas las reseñas
router.get("/", reviewController.getReviews);

// Insertar una nueva reseña
router.post("/", reviewController.insertReview);

// Eliminar reseña por ID
router.delete("/:id", reviewController.deleteReview);

// Actualizar reseña por ID
router.put("/:id", reviewController.updateReview);

export default router;
