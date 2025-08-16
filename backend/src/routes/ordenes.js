import express from "express";
import ordenesController from "../controllers/CtrlOrdenes.js";

const router = express.Router();

router.route("/enProceso/total")
  .get(ordenesController.contarOrdenesEnProceso);

router.route("/")
  .get(ordenesController.getOrdenes)
  .post(ordenesController.crearOrden);

router.route("/:id")
  .get(ordenesController.getOrdenPorId)
  .put(ordenesController.actualizarOrden)  // <-- Aquí
  .delete(ordenesController.eliminarOrden);

export default router;
