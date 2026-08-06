const express = require("express");
const router = express.Router();

const customerController = require("./customer.controller");

const protect = require("../../middleware/auth.middleware");
const authorize = require("../../middleware/authorize.middleware");

const validate = require("../../middleware/validate");
const { registerCustomerSchema } = require("./customer.schema");

router.post(
    "/",
    protect,
    authorize("admin", "staff"),
    validate(registerCustomerSchema),
    customerController.registerCustomer
);

router.get(
    "/",
    protect,
    authorize("admin", "staff"),
    customerController.getCustomers
);

router.get(
    "/:id",
    protect,
    authorize("admin", "staff"),
    customerController.getCustomerById
);

router.patch(
    "/:id",
    protect,
    authorize("admin"),
    customerController.updateCustomer
);

router.delete(
    "/:id",
    protect,
    authorize("admin"),
    customerController.deleteCustomer
);

module.exports = router;