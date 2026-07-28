const express = require("express");

const errorMiddleware = require("./middleware/error.middleware");
const userRoutes = require("./routes/user.routes");

const app = express();

// Built-in middleware
app.use(express.json());

// Route
app.use("/api/users", userRoutes);

// Global error handler
app.use(errorMiddleware);

module.exports = app;