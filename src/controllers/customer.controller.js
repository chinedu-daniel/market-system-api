const customerService = require("../services/customer.service");
const asyncHandler = require("../utils/asyncHandler");

exports.registerCustomer = asyncHandler(async(req, res) => {
    const customer = await customerService.registerCustomer(req.body, req.user);

    res.status(201).json({
        message: "Customer created successfully",
        data: customer
    });
})

exports.getCustomers = asyncHandler(async(req, res) => {
    const customers = await customerService.getCustomers();

    res.status(200).json({
        message: "Customers fetched successfully",
        data: customers
    });
});