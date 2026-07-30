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

exports.getCustomerById = async (id) => {
    const customer = await customerRepository.findCustomerById(id);

    if (!customer) {
        throw new AppError(
            "Customer not found",
            404
        );
    }

    return customer;
};

exports.updateCustomer = async (id, customerData) => {
    if (Object.keys(customerData).length === 0) {
        throw new AppError(
            "At least one field must be provided",
            400
        );
    }

    const customer  = await customerRepository.findCustomerById(id);

    if (!customer) {
        throw new AppError(
            "Customer not found",
            404
        );
    }

    if (customerData.email) {
        const existingCustomer = 
            await customerRepository.findCustomerByEmail(customerData.email);

        if (
            existingCustomer &&
            existingCustomer.id !== Number(id)
        ) {
            throw new AppError(
                "Customer with this email already exists",
                409
            );
        }
    }

    return await customerRepository.updateCustomer(
        id,
        customerData
    );
};