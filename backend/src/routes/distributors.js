import express from "express";
import distributorsController from "../controllers/CtrlDistributors.js";


const router = express.Router()

router.route("/")
.get(distributorsController.getDistributors)
.post(distributorsController.postDistributors)


router.route("/:id")
.delete(distributorsController.deleteDistributors)
.put(distributorsController.putDistributors)

export default router;