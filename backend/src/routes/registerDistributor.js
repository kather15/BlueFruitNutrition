import express from "express"
import registerDistributorsController from "../controllers/CtrlRegisterDistributors.js"

const router = express.Router();

//1-
router.route("/").post(registerDistributorsController.register)//ingresar los datos de sin repetir correo y telefono ya que estos son unicos


//2-
router.route("/verifyCodeEmail").post(registerDistributorsController.verificationCode); //para ingresar el token poner: "requireCode": "(token)"

export default router;