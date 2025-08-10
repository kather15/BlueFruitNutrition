import express from "express";
import productsController from "../controllers/CtrlProducts.js";
import multer from "multer";

const router = express.Router();

// imágenes
const upload = multer({ dest: "public/" });

// Rutas para todos los productos
router.route("/")
  .get(productsController.getProducts)
  .post(upload.single("image"), productsController.postProducts); // Para subir imagenes

// Rutas para un producto en específico (por id)
router.route("/:id")
  .get(productsController.getProductById)       // usca por ID el producto
  .delete(productsController.deleteProducts)
  .put(upload.single("image"), productsController.putProducts);  // Para actualizar imagenes

export default router;
