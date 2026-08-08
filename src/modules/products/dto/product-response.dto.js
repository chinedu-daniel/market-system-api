exports.toProductResponse = (product) => {
    return {
        id: product.id,
        name: product.name,
        description: product.description,
        price: Number(product.price),
        quantity: product.quantity,
        createdAt: product.created_at,
        updatedAt: product.updated_at
    };
};