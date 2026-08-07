const express = require("express");
const router = express.Router();

const orderController = require("./order.controller");
const protect = require("../../middleware/auth.middleware");
const authorize = require("../../middleware/authorize.middleware");

router.post(
    "/",
    protect,
    authorize("admin", "staff"),
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