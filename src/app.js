const express = require("express");

const errorMiddleware = require("./middleware/error.middleware");
const userRoutes = require("./routes/user.routes");
const customerRoutes = require("./routes/customer.routes");

const app = express();

// Built-in middleware
app.use(express.json());

// Route
app.use("/api/users", userRoutes);
app.use("/api/customers", customerRoutes);

// Global error handler
app.use(errorMiddleware);

module.exports = app;