import express from 'express';
import { handleContactForm } from '../controllers/CtrlContact.js';

const router = express.Router();

// Ruta POST para el formulario de contacto
router.post('/contact', handleContactForm);

export default router;