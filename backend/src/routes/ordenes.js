import express from 'express';
import ordenController from '../controllers/CtrlOrdenes.js';

const router = express.Router();

router.get('/', ordenController.getOrdenes);
router.post('/', ordenController.crearOrden);
router.get('/:id', ordenController.getOrdenPorId);
router.delete('/:id', ordenController.eliminarOrden);

export default router;

