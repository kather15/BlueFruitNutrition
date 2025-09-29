import express from 'express';
import {getSubscriptions,createSubscription,  deleteSubscription,  updateSubscription
} from '../controllers/CtrlSubscriptions.js';
import { authenticate, requireAdmin } from '../middlewares/auth.js';

const router = express.Router();

// 📍 Ruta pública (crear suscripción desde el frontend público)
router.post('/public', createSubscription);

// 📍 Rutas privadas (dashboard/admin)
router.get('/admin', authenticate, requireAdmin, getSubscriptions);
router.put('/admin/:id', authenticate, requireAdmin, updateSubscription);
router.delete('/admin/:id', authenticate, requireAdmin, deleteSubscription);

export default router;
