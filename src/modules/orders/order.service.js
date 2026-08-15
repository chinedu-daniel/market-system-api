const AppError = require('../../utils/appError');
const customerRepository = require('../customers/customer.repository');
const { toOrderResponse } = require('./dto/order-response.dto');
const orderRepository = require('./order.repository');
const productRepository = require("../products/product.repository");
const orderItemRepository = require("./orderItem.repository");

exports.createOrder = async({
    client,
    customerId,
    items
}) => {
    // checking duplicate product
    const productIds = items.map(item => item.productId);

    const uniqueProductIds = new Set(productIds);

    if (uniqueProductIds.size !== productIds.length) {
        throw new AppError("An order cannot contain the same product more than once", 400);
    }

    // 1. check customer
    const existingCustomer = await customerRepository.findCustomerById({
        client,
        customerId
    });

    if (!existingCustomer) {
        throw new AppError("Customer not found", 404);
    }

    // 2. sort items
    const sortedItems = [...items].sort((a, b) => a.productId - b.productId);

    // 3. lock products
    const products = [];

    for (const item of sortedItems) {
        const product = await productRepository.findProductForUpdate({
            client,
            productId: item.productId
        });

        if (!product) {
            throw new AppError(`Product ${item.productId} not found`, 404);
        }

        products.push(product);
    }

    // 4. check stock
    for (const item of sortedItems) {
        const product = products.find(product => product.id === item.productId);

        if (product.quantity < item.quantity) {
            throw new AppError(`Insufficient stock for ${product.name}`, 400);
        }
    }

    // 5. Calculate total
    let totalAmount = 0;

    for (const item of sortedItems) {
        const product = products.find(product => product.id === item.productId);

        totalAmount += Number(product.price) * item.quantity;
    }

    // 6. create order
    const order = await orderRepository.createOrder({
        client,
        customerId,
        totalAmount
    });

    // 7. create order items
    for (const item of sortedItems) {
        const product = products.find(product => product.id === item.productId);

        await orderItemRepository.createOrderItem({
            client,
            orderId: order.id,
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: product.price
        });
    }


    // 8. reduce stock
    for (const item of sortedItems) {
        await productRepository.reduceStock({
            client,
            productId: item.productId,
            quantity: item.quantity
        });
    }

    return toOrderResponse(order);
};

exports.getAllOrders = async() => {
    const order = await orderRepository.findAllOrders();

    if (!order) {
        throw new AppError("Order not found", 404);
    }

    return order.map(toOrderResponse);
};

exports.getOrderById = async (id) => {
    const order = await orderRepository.findOrderById(id)

    if (!order) {
        throw new AppError("Order not found", 404);
    }

    return toOrderResponse(order);
}