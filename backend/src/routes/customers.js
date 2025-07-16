import express from "express";
import customersController from "../controllers/CtrlCustomers.js";

const router = express.Router()

router.route("/")
.get(customersController.getCustomers)
.post(customersController.postCustomers) 


router.route("/:id")
.delete(customersController.deleteCustomers)
.put( customersController.putCustomers) 

export default router;