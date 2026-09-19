const productService = require("./product.service");
const productRepository = require("./product.repository");

jest.spyOn(productRepository, "findProductById")
    .mockResolvedValue(null);

test("throws an error when product is not found", async () => {
    await expect(
        productService.getProductById(999)
    ).rejects.toThrow("Product not found");
});