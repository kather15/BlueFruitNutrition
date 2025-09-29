// src/routes/products.js
import express from "express";
import multer from "multer";
import productsController from "../controllers/CtrlProducts.js";

const router = express.Router();

// Configuración de multer para subida de imágenes
const upload = multer({ dest: "public/" });

// Rutas principales
router
  .route("/")
  .get(productsController.getProducts) // Obtener todos los productos
  .post(upload.single("imagen"), productsController.postProducts); // Crear producto

// Ruta para obtener un producto aleatorio
router.get("/random", productsController.getRandom);

// Rutas para un producto específico por ID
router
  .route("/:id")
  .get(productsController.getProductById) // Obtener producto por ID
  .put(upload.single("imagen"), productsController.putProducts) // Actualizar producto
  .delete(productsController.deleteProducts); // Eliminar producto

export default router;
