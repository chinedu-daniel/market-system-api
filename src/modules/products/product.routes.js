const express = require("express");
const router = express.Router();

const productController = require("./product.controller");
const protect = require("../../middleware/auth.middleware");
const authorize = require("../../middleware/authorize.middleware");
const validate = require("../../middleware/validate");
const { productIdSchema, productUpdateSchema } = require("./product.validator");

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

router.get(
    "/:id",
    protect,
    authorize("admin", "staff"),
    validate(productIdSchema, "params"),
    productController.getProductById
);

router.patch(
    "/:id",
    protect,
    authorize("admin", "staff"),
    validate(productIdSchema, "params"),
    validate(productUpdateSchema, "body"),
    productController.updateProduct
);

router.delete(
    "/:id",
    protect,
    authorize("admin"),
    validate(productIdSchema, "params"),
    productController.deleteProduct
);

module.exports = router;