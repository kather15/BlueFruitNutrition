import express from "express";
import { getToken } from "../controllers/CtrlToken.js";

const router = express.Router();
router.post("/", getToken);

export default router;
