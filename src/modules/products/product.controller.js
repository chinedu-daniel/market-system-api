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