import express from "express";
import sessionController from "../controllers/CtrlSession.js";

const router = express.Router();

// GET /api/check-session
router.get("/", sessionController.checkSession);

export default router;
