import jwt from "jsonwebtoken";

export const checkSession = (req, res) => {
  const token = req.cookies?.authToken;
  if (!token) return res.status(401).json({ message: "No autenticado" });

  try {
    const data = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ id: data.id, name: data.name, email: data.email });
  } catch (err) {
    res.status(401).json({ message: "Sesión inválida" });
  }
};
