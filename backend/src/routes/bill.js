import express from "express";
import { descargarFactura, enviarFacturaEmail } from "../controllers/CtrlBill.js";

const router = express.Router();

router.get("/pdf", descargarFactura);   // /api/factura/pdf?userId=123&tipo=cliente
router.post("/email", enviarFacturaEmail);

export default router;
