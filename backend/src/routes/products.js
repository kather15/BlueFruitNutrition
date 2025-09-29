import express from "express";
import multer from "multer";
import productsController from "../controllers/CtrlProducts.js";

const router = express.Router();

const upload = multer({ dest: "public/" });

router
  .route("/")
  .get(productsController.getProducts)
  .post(upload.single("imagen"), productsController.postProducts);

router.get("/random", productsController.getRandom); //recomendar producto aleatorio

router
  .route("/:id")
  .get(productsController.getProductById)
  .put(upload.single("imagen"), productsController.putProducts)
  .delete(productsController.deleteProducts);



export default router;
