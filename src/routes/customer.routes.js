const express = require("express");
const router = express.Router();

const customerController = require("../controllers/customer.controller");

const protect = require("../middleware/auth.middleware");
const authorize = require("../middleware/authorize.middleware");

const validate = require("../middleware/validate");
const { registerCustomerSchema } = require("../validators/customer.schema");

router.post(
    "/",
    protect,
    authorize("admin", "sales"),
    validate(registerCustomerSchema),
    customerController.registerCustomer
);

router.get(
    "/",
    protect,
    authorize("admin", "sales"),
    customerController.getCustomers
);

router.get(
    "/:id",
    protect,
    authorize("admin", "sales"),
    customerController.getCustomerById
);

router.patch(
    "/:id",
    protect,
    authorize("admin", "sales"),
    customerController.updateCustomer
);

router.delete(
    "/:id",
    protect,
    authorize("admin", "sales"),
    customerController.deleteCustomer
);

module.exports = router;