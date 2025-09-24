import express from "express";
import recommendationController from "../controllers/CtrlRecommendation.js";

const router = express.Router();

router.get("/", recommendationController.getRecommendations);

export default router;
