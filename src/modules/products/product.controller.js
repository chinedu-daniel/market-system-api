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

    const filters = {
        search: req.query.search,
        name: req.query.name,
        minPrice: req.query.minPrice,
        maxPrice: req.query.maxPrice
    };

    const sort = req.query.sort || "newest";

    const result = await productService.getProducts(
        page,
        limit,
        filters,
        sort
    );

    res.status(200).json({
        success: true,
        results: result.products.length,
        pagination: result.pagination,
        data: result.products
    });
});

exports.getProductById = asyncHandler(async (req, res) => {
    const product = await productService.getProductById(req.params.id);

    res.status(200).json({
        success: true,
        data: product
    });
});