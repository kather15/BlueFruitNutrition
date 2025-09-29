import express from "express";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import fs from "fs";
import path from "path";

// Rutas
import productsRoutes from "./src/routes/products.js";
import customersRouter from "./src/routes/customers.js";
import distributorsRoutes from "./src/routes/distributors.js";
import registerCustomersRoutes from "./src/routes/registerCustomer.js";
import registerDistributorsRoutes from "./src/routes/registerDistributor.js";
import passwordRecoveryRoutes from "./src/routes/passwordRecovery.js";
import loginRoutes from "./src/routes/login.js";
import logoutRoutes from "./src/routes/logout.js";
import subscriptionRoutes from "./src/routes/subscriptions.js";
import shoppingCartRoutes from "./src/routes/shoppingCart.js";
import ordenesRoutes from "./src/routes/ordenes.js";
import ReviewRouters from "./src/routes/reviews.js";
import ContactRoutes from "./src/routes/contact.js";
import PayRoutes from "./src/routes/pay.js";
import TestPay from "./src/routes/testPayment.js";
import tokenRouter from "./src/routes/token.js";
import adminVerifyRoutes from "./src/routes/adminVerify.js";
import sessionRouter from "./src/routes/session.js";
import chatRoutes from "./src/routes/chatRoutes.js";
import BillRoutes from "./src/routes/bill.js";
import locationRoutes from "./src/routes/location.js";
import profileRoutes from "./src/routes/profile.js";
import recommendationRoutes from "./src/routes/recommendation.js";

// Middleware para autenticación (usado para proteger rutas)
import { authenticate } from "./src/middleware/authenticate.js"; // Asegúrate de tener este middleware

const app = express();

// -------------------------------------------
// CORS seguro con cookies
// -------------------------------------------
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://bluefruitnutrition-production.up.railway.app",
  "https://blue-fruit-nutrition-git-master-bluefruitnutrition.vercel.app",
  "https://blue-fruit-nutrition-private.vercel.app",
  "https://blue-fruit-nutrition-4vhs.vercel.app",
];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET,POST,PUT,DELETE,OPTIONS"
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );
  }

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

// -------------------------------------------
// JSON y cookies
// -------------------------------------------
app.use(express.json());
app.use(cookieParser());

// -------------------------------------------
// Swagger
// -------------------------------------------
const swaggerFilePath = path.resolve(
  "./bluefruit-bluefruit_api-1.0.0-swagger.json"
);
const swaggerDocument = JSON.parse(fs.readFileSync(swaggerFilePath, "utf-8"));
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// -------------------------------------------
// Endpoints
// -------------------------------------------
app.use("/api/products", productsRoutes);
app.use("/api/customers", customersRouter);
app.use("/api/distributors", distributorsRoutes);
app.use("/api/registerCustomers", registerCustomersRoutes);
app.use("/api/registerDistributors", registerDistributorsRoutes);
app.use("/api/passwordRecovery", passwordRecoveryRoutes);
app.use("/api/login", loginRoutes);
app.use("/api/logout", logoutR/api/check-sessionoutes);
app.use("/api/shoppingCart", shoppingCartRoutes);
app.use("/api/subscriptions", subscriptionRoutes);
app.use("/api/ordenes", ordenesRoutes);
app.use("/api/reviews", ReviewRouters);
app.use("/api/contact", ContactRoutes);
app.use("/api/pay", PayRoutes);
app.use("/api/testPay", TestPay);
app.use("/api/token", tokenRouter);
app.use("/api/admin", adminVerifyRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/bill", BillRoutes);
app.use("/api/location", locationRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/recommendation", recommendationRoutes);

// 🔹 Ruta de sesión protegida para frontend
app.use("/api/session", sessionRouter); // sessionRouter debe exponer GET /auth/session
// Ejemplo de cómo protegerlo con middleware:
// sessionRouter.get("/auth/session", authenticate, checkSessionController);


// -------------------------------------------
// Manejo de errores simples
// -------------------------------------------
app.use((req, res, next) => {
  res.status(404).json({ message: "Ruta no encontrada" });
});

app.use((err, req, res, next) => {
  console.error("Error interno:", err);
  res.status(500).json({ message: "Error interno del servidor" });
});

export default app;
