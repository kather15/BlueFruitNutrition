import express from "express";
import adminVerificationController from "../controllers/CtrlVerifyAdmin.js";
import { authenticate, requireAdmin } from "../middlewares/auth.js";

const router = express.Router();

router.post("/send-code", authenticate, adminVerificationController.sendCode);
router.post("/verify-code", authenticate,  adminVerificationController.verifyCode);

export default router;
