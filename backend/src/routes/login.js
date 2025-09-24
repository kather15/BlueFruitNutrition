import express from "express";
import loginController from "../controllers/CtrlLogin.js";

const router = express.Router();


router.post("/", loginController.login);

export default router;
