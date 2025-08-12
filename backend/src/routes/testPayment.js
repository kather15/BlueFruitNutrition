import express from "express";
import { testPayment } from "../controllers/CtrlTestPayment.js";

const router = express.Router();

// Ruta: POST /api/testPayment
router.post("/", testPayment);

export default router;
