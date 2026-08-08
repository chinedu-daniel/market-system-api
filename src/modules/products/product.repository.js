const db = require("../../db/database");

exports.findProductByName = async (name) => {
    const result = await db.query(
        `
        SELECT
            id,
            name,
            description,
            price,
            quantity,
            created_at,
            updated_at
        FROM products
        WHERE name = $1
        `,
        [name]
    );

    return result.rows[0];
};

exports.createProduct = async ({ 
    name,
    description,
    price,
    quantity
}) => {
    const result = await db.query(
        `
        INSERT INTO products (
            name,
            description,
            price,
            quantity
        )
        VALUES ($1, $2, $3, $4)
        RETURNING 
            id,
            name,  
            description,
            price,
            quantity,
            created_at,
            updated_at 
       `,
       [name, description, price, quantity]    
    );

    return result.rows[0];
};

exports.findAllProducts = async (limit, offset) => {
    const result = await db.query(
        `
        SELECT 
            id,
            name,
            description,
            price,
            quantity,
            created_at,
            updated_at
        FROM products
        ORDER BY created_at DESC
        LIMIT $1
        OFFSET $2
        `,

        [limit, offset]
    );

    return result.rows;
};