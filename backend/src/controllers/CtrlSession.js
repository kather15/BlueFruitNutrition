// src/controllers/CtrlSession.js
export const checkSession = (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "No autenticado", isAuthenticated: false });
    }

    res.status(200).json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.userType || req.user.role,
      isAuthenticated: true
    });
  } catch (error) {
    console.error("Error en checkSession:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};
