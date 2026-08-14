exports.createOrderItem = async ({
    client,
    orderId,
    productId,
    quantity,
    unitPrice
}) => {
    const result = await client.query(
        `
        INSERT INTO order_items
        (
            order_id,
            product_id,
            quantity,
            unit_price
        )
        VALUES ($1, $2, $3, $4)
        RETURNING
            id,
            order_id,
            product_id,
            quantity,
            unit_price,
            created_at
        `,
        [
            orderId,
            productId,
            quantity,
            unitPrice
        ]
    );

    return result.rows[0];
};