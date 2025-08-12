import express from "express";
//import { getToken } from "../controllers/CtrlToken.js";
import { payment3ds } from "../controllers/CtrlPayment3ds.js";

const router = express.Router();

// Ruta para obtener token de autenticación (POST /api/token)
//router.post("/token", getToken);

// Ruta para procesar un pago de prueba (POST /api/testPayment)


// Ruta para procesar un pago real con 3DS (POST /api/payment3ds)
router.post("/payment3ds", payment3ds);

export default router;
