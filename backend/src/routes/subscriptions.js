import express from 'express';
import {
  getSubscriptions,
  createSubscription,
  deleteSubscription,
  updateSubscription
} from '../controllers/CtrlSubscriptions.js';

const router = express.Router();

router.get('/', getSubscriptions);
router.post('/', createSubscription);
router.delete('/:id', deleteSubscription);
router.put('/:id', updateSubscription);

export default router;
