const express = require("express");
const cookieParser = require("cookie-parser");
// const cors = require("cors");
const errorMiddleware = require("./middleware/error.middleware");
const { userRoutes } = require("./modules/users");
const { customerRoutes } = require("./modules/customers");
const { orderRoutes } = require("./modules/orders");
const { productRoutes } = require("./modules/products");

const app = express();

// app.use(
//     cors({
//         origin: "http://localhost:5173"
//     })
// );

// Built-in middleware
app.use(express.json());
app.use(cookieParser());

// Route
app.use("/api/users", userRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/products", productRoutes)

// Global error handler
app.use(errorMiddleware);

module.exports = app;