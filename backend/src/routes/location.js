const express = require('express');
const router = express.Router();
const controller = require('../controllers/CrtlLocation');

router.get('/', controller.getLocations);
router.post('/', controller.createLocation);
router.put('/:id', controller.updateLocation);
router.delete('/:id', controller.deleteLocation);

module.exports = router;
