const AppError = require('../../utils/appError');
const customerRepository = require('../customers/customer.repository');
const orderRepository = require('./order.repository');

exports.createOrder = async(customerId, totalAmount) => {
    const existingCustomer = await customerRepository.findCustomerById(customerId);

    if (!existingCustomer) {
        throw new AppError("Customer not found", 404);
    }

    const order = await orderRepository.createOrder(customerId, totalAmount);

    return order;
};