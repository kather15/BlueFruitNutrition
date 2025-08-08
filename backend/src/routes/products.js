import express from "express";
import productsController from "../controllers/CtrlProducts.js";
import multer from "multer";

const router = express.Router()

//imagenes
const upload = multer({dest: "public/"})

router.route("/")
.get(productsController.getProducts)
.get("/:id", productsController.getProductById) // Esta es la ruta que manda a llamar el ID por productos para las reviews
.post(upload.single("image"), productsController.postProducts) //upload.single("image"), para guardar las nuevas imagenes


router.route("/:id")
.delete(productsController.deleteProducts)
.put(upload.single("image"), productsController.putProducts) //upload.single("image"), para guardar las nuevas imagenes

export default router;