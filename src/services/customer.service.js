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

exports.getCustomers = async (page, limit) => {
    const offset = (page - 1) * limit;
    const customers = await customerRepository.findAllCustomers(limit, offset);

    const totalItems = await customerRepository.countCustomers();

    const totalPages = Math.ceil(totalItems / limit);

    const hasNextPage = page < totalPages;

    const hasPreviousPage = page > 1;

    return {
        customers,
        pagination: {
            page,
            limit,
            totalItems,
            totalPages,
            hasNextPage,
            hasPreviousPage
        }
    }
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

exports.deleteCustomer = async (id) => {
    const deletedCustomer = await customerRepository.deleteCustomer(id)

    if (!deletedCustomer) {
        throw new AppError(
            "Customer not found",
            404
        );
    }

    return deletedCustomer;
};