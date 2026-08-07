const AppError = require('../../utils/appError');
const customerRepository = require('../customers/customer.repository');
const { toOrderResponse } = require('./dto/order-response.dto');
const orderRepository = require('./order.repository');

exports.createOrder = async(customerId, totalAmount) => {
    const existingCustomer = await customerRepository.findCustomerById(customerId);

    if (!existingCustomer) {
        throw new AppError("Customer not found", 404);
    }

    const order = await orderRepository.createOrder(customerId, totalAmount);

    return toOrderResponse(order);
};

exports.getAllOrders = async() => {
    const order = await orderRepository.findAllOrders();

    return order.map(toOrderResponse);
};

exports.getOrderById = async (id) => {
    const order = await orderRepository.findOrderById(id)

    if (!order) {
        throw new AppError("Order not found", 404);
    }

    return toOrderResponse(order);
}