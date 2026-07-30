const customerService = require("../services/customer.service");
const asyncHandler = require("../utils/asyncHandler");

exports.registerCustomer = asyncHandler(async (req, res) => {
    const customer = await customerService.registerCustomer(req.body, req.user);

    res.status(201).json({
        message: "Customer created successfully",
        data: customer
    });
})

exports.getCustomers = asyncHandler(async (req, res) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const customers = await customerService.getCustomers(page, limit);

    res.status(200).json({
        status: "success",
        data: customers
    });
});

exports.getCustomerById = asyncHandler(async (req, res) => {
    const customer = await customerService.getCustomerById(req.params.id);

    res.status(200).json({
        message: "Customer fetched successfully",
        data: customer
    });
});

exports.updateCustomer = asyncHandler(async (req, res) => {
    const customer = await customerService.updateCustomer(
        req.params.id,
        req.body
    );

    res.status(200).json({
        status: "success",
        data: customer
    });
});

exports.deleteCustomer = asyncHandler(async (req, res) => {
    await customerService.deleteCustomer(req.params.id);

    res.status(200).json({
        status: "success",
        message: "Customer delete successfully"
    });
});