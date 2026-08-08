const AppError = require("../../utils/appError");
const { toProductResponse } = require("./dto/product-response.dto");
const productRepository = require("./product.repository");

exports.createProduct = async(productData) => {
    // console.log("SERVICE productData:", productData);

    const { name } = productData;

    const existingProduct = await productRepository.findProductByName(name);

    // console.log("EXISTING PRODUCT:", existingProduct);

    if (existingProduct) {
        throw new AppError("Product already exists", 409)
    }

    const product = await productRepository.createProduct(productData);

    // console.log("CREATED PRODUCT:", product);

    return toProductResponse(product);
}