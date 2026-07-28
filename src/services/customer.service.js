const customerRepository = require("../repositories/customer.respository");
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