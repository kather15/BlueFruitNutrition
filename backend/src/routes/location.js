import express from "express";
import { 
  getLocations, 
  getLocationById, 
  createLocation, 
  updateLocation, 
  deleteLocation 
} from "../controllers/CrtlLocation.js";

const router = express.Router();

// Con tu configuración actual: /api/location + estas rutas
// GET /api/location/ - Obtener todas las ubicaciones  
router.get('/', getLocations);

// GET /api/location/:id - Obtener ubicación por ID
router.get('/:id', getLocationById);

// POST /api/location/ - Crear nueva ubicación
router.post('/', createLocation);

// PUT /api/location/:id - Actualizar ubicación
router.put('/:id', updateLocation);

// DELETE /api/location/:id - Eliminar ubicación
router.delete('/:id', deleteLocation);

export default router;