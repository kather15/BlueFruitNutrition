import express from "express";
import sessionController from "../controllers/CtrlSession.js";
import { authenticate } from "../middlewares/auth.js";

const router = express.Router();

// ✅ Ruta protegida para verificar sesión actual
router.get("/auth/session", authenticate, sessionController.checkSession);

export default router;
