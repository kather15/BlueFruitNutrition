import express from "express";
import recommendationController from "../controllers/recommendationController.js";

const router = express.Router();

router.get("/recommendations", recommendationController.getRecommendations);

export default router;
