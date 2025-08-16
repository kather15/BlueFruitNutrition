import express from 'express';
import {
  getSubscriptions,
  createSubscription,
  deleteSubscription,
  updateSubscription
} from '../controllers/CtrlSubscriptions.js';

const router = express.Router();

// GET todas las suscripciones
router.get('/', getSubscriptions);

// POST crear una nueva suscripción
router.post('/', createSubscription);

// DELETE borrar por ID
router.delete('/:id', deleteSubscription);

// PUT actualizar por ID
router.put('/:id', updateSubscription);

export default router;
