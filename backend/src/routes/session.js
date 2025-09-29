import express from "express";
import { checkSession } from "../controllers/CtrlSession.js";

const router = express.Router();

// GET /api/session/auth/session
router.get("/auth/session", checkSession);

export default router;
