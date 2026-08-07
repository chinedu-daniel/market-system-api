exports.toOrderResponse = (order) => {
    return {
        id: order.id,
        customer: {
            id: order.customer_id,
            firstName: order.first_name,
            lastName: order.last_name,
            email: order.email,
        },

        totalAmount: Number(order.total_amount),
        status: order.status,
        createdAt: order.created_at
    };
}