import { Router } from "express";
import reviewController from "../controllers/CtrlReview.js";
import { authenticate } from "../middlewares/auth.js"; // corregido aquí

const router = Router();

// Obtener reseñas (no requiere autenticación)
router.get("/", reviewController.getReviews);

// Crear reseña (requiere autenticación)
router.post("/", authenticate, reviewController.insertReview);

// Actualizar reseña (requiere autenticación)
router.put("/:id", authenticate, reviewController.updateReview);

// Eliminar reseña (requiere autenticación)
router.delete("/:id", authenticate, reviewController.deleteReview);

// Rutas de administrador para reviews (sin autenticación)
router.delete('/reviews/:id', reviewController.deleteReviewAdmin);
router.get('/reviews', reviewController.getReviews);

export default router;
