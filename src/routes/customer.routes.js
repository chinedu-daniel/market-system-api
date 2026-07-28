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

module.exports = router;