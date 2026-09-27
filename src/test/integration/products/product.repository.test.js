require("dotenv").config();

const db = require("../../../db/database");
const productRepository = require("../../../modules/products/product.repository");

describe("Product Repository Integration Tests", () => {

    let productId;

    test("should connect to the test database", async () => {
        const insertResult = await db.query(
            `
            INSERT INTO products (
                name,
                description,
                price,
                quantity
            )
            VALUES ($1, $2, $3, $4)
            RETURNING id
            `,
            [
                "Integration Test Product",
                "Product created for integration testing",
                500000,
                10
            ]
        );

        productId = insertResult.rows[0].id;

        const product = await productRepository.findProductById(productId);

        expect(product).toEqual(
            expect.objectContaining({
                id: productId,
                name: "Integration Test Product",
                description: "Product created for integration testing",
                price: "500000.00",
                quantity: 10
            })
        );
    });

    afterEach(async () => {
        if (productId) {
            await db.query(
                "DELETE FROM products WHERE id = $1",
                [productId]
            );
        }
    });

    afterAll(async () => {
        await db.end();
    });
});