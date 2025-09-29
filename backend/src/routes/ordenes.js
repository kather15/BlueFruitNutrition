import express from "express";
import ordenesController from "../controllers/CtrlOrdenes.js";

const router = express.Router();

// Contar órdenes en proceso
router.get("/enProceso/total", ordenesController.contarOrdenesEnProceso);

// Operaciones CRUD de órdenes
router.route("/")
  .get(ordenesController.getOrdenes)
  .post(ordenesController.crearOrden);

router.route("/:id")
  .get(ordenesController.getOrdenPorId)
  .put(ordenesController.actualizarOrden)
  .delete(ordenesController.eliminarOrden);

// Obtener órdenes de un usuario específico
router.get("/user/:userId", ordenesController.getOrdenesPorUsuario);

export default router;
