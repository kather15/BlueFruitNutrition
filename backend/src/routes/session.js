import express from "express";
import sessionController from "../controllers/CtrlSession.js";

const router = express.Router();

router.get("/auth/session", sessionController.checkSession);

export default router