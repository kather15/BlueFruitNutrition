import { Router } from "express";
import reviewController from "../controllers/CtrlReview.js";
import { authenticateToken } from "../middlewares/auth.js";

const router = Router();

// Obtener reseñas (no requiere autenticación)
router.get("/", reviewController.getReviews);
//  Crear reseña (requiere autenticación)
router.post("/", authenticateToken, reviewController.insertReview);
//  Actualizar reseña (requiere autenticación)
router.put("/:id", authenticateToken, reviewController.updateReview);
//  Eliminar reseña (requiere autenticación)
router.delete("/:id", authenticateToken, reviewController.deleteReview);

// Rutas de administrador para reviews (sin autenticación)
router.delete('/reviews/:id', reviewController.deleteReviewAdmin);
router.get('/reviews', reviewController.getReviews);

export default router;

