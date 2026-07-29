const customerRepository = require("../repositories/customer.repository");
const AppError = require("../utils/appError");

exports.registerCustomer = async (customerData, currentUser) => {
    const existingCustomer = await customerRepository.findCustomerByEmail(customerData.email);

    if (existingCustomer) {
        throw new AppError(
            "Customer with this email already exists", 409
        );
    }

    const customer = await customerRepository.createCustomer(customerData);

    return customer;
};

exports.getCustomers = async () => {
    const customers = await customerRepository.findAllCustomers();

    return customers;
};