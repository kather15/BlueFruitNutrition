import express from "express"
import passwordRecoveryController from "../controllers/CtrlPasswordRecovery.js"

const router = express.Router();

router.route("/requestCode").post(passwordRecoveryController.requestCode); //aqui se ingresa el email
router.route("/verifyCode").post(passwordRecoveryController.verfiedCode);//aqui se ingresa el code que se mando por correo 
router.route("/newPassword").post(passwordRecoveryController.newPassword);//aqui se ingresa la nueva contraseña

export default router;