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
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const products = await productService.getProducts(
        page,
        limit
    );

    res.status(200).json({
        status: true,
        results: products.length,
        data: products
    });
});