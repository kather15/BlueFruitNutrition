import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import productsRoutes from "./src/routes/products.js";
import customersRouter from "./src/routes/customers.js";
import distributorsRoutes from "./src/routes/distributors.js"
import registerCustomersRoutes from "./src/routes/registerCustomer.js"
import passwordRecoveryRoutes from "./src/routes/passwordRecovery.js";
import loginRoutes from "./src/routes/login.js"
import logoutRoutes from "./src/routes/logout.js";
import subscriptionRoutes from './src/routes/subscriptions.js';
import shoppingCartRoutes from './src/routes/shoppingCart.js'

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"], // Permite ambos puertos
    credentials: true
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/products", productsRoutes);
app.use("/api/customers", customersRouter);
app.use("/api/distributors", distributorsRoutes);
app.use("/api/registerCustomers", registerCustomersRoutes)
app.use("/api/passwordRecovery", passwordRecoveryRoutes);
app.use("/api/login", loginRoutes);
app.use("/api/logout", logoutRoutes);
app.use("/api/shoppingCart", shoppingCartRoutes)
app.use('/api/subscriptions', subscriptionRoutes);


export default app;