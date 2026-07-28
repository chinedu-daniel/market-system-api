const customerService = require("../services/customer.service");

exports.createCustomer = async(req, res) => {
    const customer = await customerService.createCustomer(req.body);

    res.status(201).json({
        message: "Customer created successfully",
        data: customer
    });
}