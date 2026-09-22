const productService = require("../../../modules/products/product.service");
const productRepository = require("../../../modules/products/product.repository");


const mockProduct = {
    id: 1,
    name: "Suzuki K6A",
    price: "500000.00",
    quantity: 10,
    is_active: true
};


jest.spyOn(productRepository, "findProductById")
    .mockResolvedValue(mockProduct);

jest.spyOn(productRepository, "updateProduct");

jest.spyOn(productRepository, "deleteProduct");

test("returns product when product exists", async () => {
    await expect(
        productService.getProductById(1)
    ).resolves.toEqual({
        id: 1,
        name: "Suzuki K6A",
        description: undefined,
        price: 500000,
        quantity: 10,
        isActive: true,
        createdAt: undefined,
        updatedAt: undefined
    });
});

test("returns 404 when product is not found", async () => {
    expect.assertions(1);

    productRepository.findProductById.mockResolvedValue(null);

    try {
        await productService.getProductById(1);
    } catch (error) {
        expect(error.statusCode).toBe(404);
    }
});

test("updates product when product exists", async () => {
    const existingProduct = {
        id: 1,
        name: "Suzuki K6A",
        price: 500000.00,
        quantity: 10,
        is_active: true
    };

    const updatedProduct = {
        id: 1,
        name: "Suzuki K6A",
        price: 550000.00,
        quantity: 8,
        is_active: true
    };

    productRepository.findProductById.mockResolvedValue(existingProduct);

    productRepository.updateProduct.mockResolvedValue(updatedProduct);

    const result = await productService.updateProduct(1, {
        price: 550000.00,
        quantity: 8
    });

    await expect(result).toEqual({
        id: 1,
        name: "Suzuki K6A",
        description: undefined,
        price: 550000,
        quantity: 8,
        isActive: true,
        createdAt: undefined,
        updatedAt: undefined
    });
});

test("returns 404 when product to update is not found", async () => {
    productRepository.findProductById.mockResolvedValue(null);

    await expect (
        productService.updateProduct(1, {
            price: 550000.00
        })
    ).rejects.toThrow("Product not found");
});


test("deletes product when product exists and is active", async () => {
    const existingProduct = {
        id: 1,
        name: "Suzuki K6A",
        price: 500000.00,
        quantity: 10,
        is_active: true
    };

    const deletedProduct = {
        id: 1,
        name: "Suzuki K6A",
        price: 500000.00,
        quantity: 10,
        is_active: false
    };

    productRepository.findProductById.mockResolvedValue(existingProduct);

    productRepository.deleteProduct.mockResolvedValue(deletedProduct);

    const result = await productService.deleteProduct(1);

    expect(result).toEqual({
        id: 1,
        name: "Suzuki K6A",
        description: undefined,
        price: 500000,
        quantity: 10,
        isActive: false,
        createdAt: undefined,
        updatedAt: undefined
    });
});


test("returns 404 when product to delete is not found", async () => {
    productRepository.findProductById.mockResolvedValue(null);

    await expect (
        productService.deleteProduct(1)
    ).rejects.toThrow("Product not found");
});

test("returns 400 when product is already inactive", async () => {
    const inactiveProduct = {
        id: 1,
        name: "Suzuki K6A",
        price: 500000.00,
        quantity: 10,
        is_active: false
    };

    productRepository.findProductById.mockResolvedValue(inactiveProduct);

    await expect (
        productService.deleteProduct(1)
    ).rejects.toThrow("Product is already inactive");
});