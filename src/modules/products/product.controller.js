const asyncHandler = require("../../utils/asyncHandler");
const productService = require("./product.service");

exports.createProduct = asyncHandler(async (req, res) => {
    const product = await productService.createProduct(req.body);

    res.status(201).json({
        success: true,
        message: "Product created successfully",
        data: product
    });
});

exports.getProduct = asyncHandler(async (req, res) => {
    const product = await productService.getProducts(req.body)

    res.status(200).json({
        status: true,
        results: product.length,
        data: product
    });
});