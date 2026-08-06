const db = require("../../db/database");

exports.createOrder = async (customerId, totalAmount) => {
    const result = await db.query(
        `
        INSERT INTO orders (
            customer_id,
            total_amount
        )
            VALUES ($1, $2)
            RETURNING *
        `,
        [customerId, totalAmount]
    );

    return result.rows[0];
};

exports.findAllOrders = async () => {
    const result = await db.query(
        `
        SELECT 
            o.id,
            c.id AS customer_id,
            c.first_name,
            c.last_name,
            c.email,
            o.total_amount,
            o.created_at
        FROM orders o
        INNER JOIN customers c
            ON o.customer_id = c.id
        ORDER BY o.created_at DESC
        `
    );
    
    return result.rows;
};