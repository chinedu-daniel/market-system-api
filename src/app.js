const express = require("express");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const errorMiddleware = require("./middleware/error.middleware");
const { userRoutes } = require("./modules/users");
const { customerRoutes } = require("./modules/customers");
const { orderRoutes } = require("./modules/orders");
const { productRoutes } = require("./modules/products");

const app = express();

app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true
    })
);

// Built-in middleware
app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());
app.use(helmet());
app.use(morgan("combined"));

// Route
app.use("/api/users", userRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/products", productRoutes)

// Global error handler
app.use(errorMiddleware);

module.exports = app;