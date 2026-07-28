const customerService = require("../services/customer.service");
const asyncHandler = require("../utils/asyncHandler");

exports.registerCustomer = asyncHandler(async(req, res) => {
    const customer = await customerService.registerCustomer(req.body, req.user);

    res.status(201).json({
        message: "Customer created successfully",
        data: customer
    });
})