import express from "express";
import ShoppingCartController from "../controllers/CtrlShoppingCart.js"; 
const router = express.Router();

router
  .route("/")
  .get(ShoppingCartController.getShoppingCart)
  .post(ShoppingCartController.insertShoppingCart);
 
router
  .route("/:id")
  .put(ShoppingCartController.updateShoppingCart)
  .delete(ShoppingCartController.deleteShoppingCart);
 
export default router;