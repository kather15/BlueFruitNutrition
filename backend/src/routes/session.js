import express from "express";
import sessionController from "../controllers/CtrlSession.js";
import { authenticate } from "../middlewares/auth.js"; 

const router = express.Router();

// Usar authenticate middleware y la ruta correcta
router.get("/verify-session", authenticate, sessionController.checkSession);

export default router;