import express from "express";
import loginController from "../controllers/CtrlLogin.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { email, password } = req.body;
  try {
    const token = await loginController.login(email, password);

    // Cookie httpOnly, cross-site
    res.cookie("authToken", token, {
      httpOnly: true,
      secure: true,    
      sameSite: "none" 
    });

    res.json({ message: "Login exitoso" });
  } catch (err) {
    res.status(401).json({ message: "Credenciales inválidas" });
  }
});

export default router;
