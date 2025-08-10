import express from 'express';
import logoutController from '../controllers/CtrlLogout.js';

const router = express.Router();
router.route("/").post(logoutController.logout);


export default router;