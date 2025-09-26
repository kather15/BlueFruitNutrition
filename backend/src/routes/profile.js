import express from "express";
import { authenticate } from "../middlewares/auth.js";
import customersModel from "../models/Customers.js";
import distributorModel from "../models/Distributors.js";

const router = express.Router();

router.get("/", authenticate, async (req, res) => {
  try {
    const { email, role } = req.user;

    let user;
    if (role === "distributor") {
      user = await distributorModel.findOne({ email }).select("-password");
    } else {
      user = await customersModel.findOne({ email }).select("-password");
    }

    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

export default router;
