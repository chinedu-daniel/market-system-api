const express = require("express");
const router = express.Router();

const productController = require("./product.controller");
const protect = require("../../middleware/auth.middleware");
const authorize = require("../../middleware/authorize.middleware");

router.post(
    "/", 
    protect,
    authorize("admin", "staff"),
    productController.createProduct
);

router.get(
    "/",
    protect,
    authorize("admin", "staff"),
    productController.getProduct
);

module.exports = router;