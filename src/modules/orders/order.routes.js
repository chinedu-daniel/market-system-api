const express = require("express");
const router = express.Router();

const orderController = require("./order.controller");
const protect = require("../../middleware/auth.middleware");
const authorize = require("../../middleware/authorize.middleware");
const validate = require("../../middleware/validate");
const { createOrderSchema } = require("./order.schema");

router.post(
    "/",
    protect,
    authorize("admin", "staff"),
    validate(createOrderSchema, "body"),
    orderController.createOrder
);

router.get(
    "/",
    protect,
    authorize("admin", "staff"),
    orderController.getAllOrders
);

router.get(
    "/:id",
    protect,
    authorize("admin", "staff"),
    orderController.getOrderById
);

module.exports = router;