// Dependencias--------------------------------------------------------------------------------
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

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
import adminVerifyRoutes from "./src/routes/adminVerify.js";
import sessionRouter from "./src/routes/session.js";

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"], // Permite ambos puertos
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// Endpoints
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
app.use("/api", ContactRoutes);
app.use("/api/admin", adminVerifyRoutes);
app.use("/api", sessionRouter);

export default app;
