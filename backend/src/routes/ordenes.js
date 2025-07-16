const router = express.Router();
const ordenController = require('../controllers/ordenController');

router.get('/', ordenController.getOrdenes);
router.post('/', ordenController.crearOrden);
router.get('/:id', ordenController.getOrdenPorId);
router.delete('/:id', ordenController.eliminarOrden);

module.exports = router;
