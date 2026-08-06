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