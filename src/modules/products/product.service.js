const AppError = require("../../utils/appError");
const { toProductResponse } = require("./dto/product-response.dto");
const productRepository = require("./product.repository");

exports.createProduct = async(productData) => {

    const { name } = productData;

    const existingProduct = await productRepository.findProductByName(name);

    if (existingProduct) {
        throw new AppError("Product already exists", 409)
    }

    const product = await productRepository.createProduct(productData);

    return toProductResponse(product);
}

exports.getProducts = async (page, limit, filters, sort) => {
    const offset = (page - 1) * limit;

    const products = await productRepository.findAllProducts(
        limit,
        offset,
        filters,
        sort
    );

    const totalItems = await productRepository.countProducts(filters);

    const totalPages = Math.ceil(totalItems / limit);

    return {
        products: products.map(toProductResponse),
        pagination: {
            page,
            limit,
            totalItems,
            totalPages
        }
    };
};

exports.getProductById = async (id) => {
    const product = await productRepository.findProductById(id);

    if (!product) {
        throw new AppError(
            "Product not found", 404
        );
    }

    return toProductResponse(product);
};

exports.updateProduct = async (id, updates) => {
    const existingProduct = await productRepository.findProductById(id);

    if (!existingProduct) {
        throw new AppError("Product not found", 404);
    }

    const updatedProduct = await productRepository.updateProduct(id, updates);

    return toProductResponse(updatedProduct);
}