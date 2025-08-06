const express = require('express');
const router = express.Router();
const { handleContactForm } = require('../controllers/CtrlContact.js');

// Ruta POST /api/contact que llama al controlador para procesar el formulario
router.post('/contact', handleContactForm);

module.exports = router;
