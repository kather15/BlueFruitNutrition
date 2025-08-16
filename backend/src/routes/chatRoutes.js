import express from "express";
import { getAnswer, addQuestion } from "../controllers/CtrlQuestions.js";

const router = express.Router();

// Endpoint para obtener respuesta
router.post("/qa", getAnswer);

// Endpoint para agregar pregunta-respuesta
router.post("/add", addQuestion);

export default router;
