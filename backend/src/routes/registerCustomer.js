import express from "express";
import registerCustomersController from "../controllers/CtrlRegisterCustomers.js";

const router = express.Router();

//1-
router.route("/").post(registerCustomersController.register); //ingresar los datos de sin repetir correo y telefono ya que estos son unicos

//2-
router.route("/verifyCodeEmail").post(registerCustomersController.verificationCode); //para ingresar el token poner: "requireCode": "(token)"


export default router;