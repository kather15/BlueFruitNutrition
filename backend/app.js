// Dependencias--------------------------------------------------------------------------------
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import fs from "fs";
import path from "path";

// Rutas----------------------------------------------------------------------------------------
import productsRoutes from "./src/routes/products.js";
import customersRouter from "./src/routes/customers.js";
import distributorsRoutes from "./src/routes/distributors.js";
import registerCustomersRoutes from "./src/routes/registerCustomer.js";
import registerDistributorsRoutes from "./src/routes/registerDistributor.js";
import passwordRecoveryRoutes from "./src/routes/passwordRecovery.js";
import loginRoutes from "./src/routes/login.js";
import logoutRoutes from './src/routes/logout.js';
import subscriptionRoutes from './src/routes/subscriptions.js';
import shoppingCartRoutes from './src/routes/shoppingCart.js';
import ordenesRoutes from './src/routes/ordenes.js'; 
import ReviewRouters from "./src/routes/reviews.js";
import ContactRoutes from "./src/routes/contact.js";
import PayRoutes from "./src/routes/pay.js";
import TestPay from "./src/routes/testPayment.js";
import tokenRouter from "./src/routes/token.js";
import adminVerifyRoutes from "./src/routes/adminVerify.js";
import sessionRouter from "./src/routes/session.js";
import chatRoutes from "./src/routes/chatRoutes.js";
import BillRoutes from "./src/routes/bill.js"; 

// Inicialización de app
const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174", "https://blue-fruit-nutrition-1mel.vercel.app"],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// -------------------------------------------
// Configuración de Swagger
// -------------------------------------------

// Traemos el archivo JSON de Swagger
const swaggerFilePath = path.resolve("./bluefruit-bluefruit_api-1.0.0-swagger.json");
const swaggerDocument = JSON.parse(fs.readFileSync(swaggerFilePath, "utf-8"));

// Endpoint para mostrar la documentación
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// -------------------------------------------
// Endpoints API
// -------------------------------------------
app.use("/api/products", productsRoutes);
app.use("/api/customers", customersRouter);
app.use("/api/distributors", distributorsRoutes);
app.use("/api/registerCustomers", registerCustomersRoutes);
app.use("/api/registerDistributors", registerDistributorsRoutes);
app.use("/api/passwordRecovery", passwordRecoveryRoutes);
app.use("/api/login", loginRoutes);
app.use("/api/logout", logoutRoutes);
app.use("/api/shoppingCart", shoppingCartRoutes);
app.use("/api/subscriptions", subscriptionRoutes);
app.use("/api/ordenes", ordenesRoutes);
app.use("/api/reviews", ReviewRouters);
app.use("/api/contact", ContactRoutes);
app.use("/api/pay", PayRoutes);
app.use("/api/testPay", TestPay);
app.use("/api/token", tokenRouter);
app.use("/api/admin", adminVerifyRoutes);
app.use("/api/session", sessionRouter);
app.use("/api/chat", chatRoutes);
app.use("/api/bill", BillRoutes);

// Exportar app
export default app;
