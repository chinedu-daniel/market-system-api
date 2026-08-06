const asyncHandler = require("../../utils/asyncHandler");
const orderService = require("./order.service");

exports.createOrder = asyncHandler(async (req, res, next) => {
    const { 
        customer_id,
        total_amount
    } = req.body;

    const order = await orderService.createOrder(
        customer_id,
        total_amount
    );

    res.status(201).json({
        success: true,
        message: "Order created successfully",
        data: order
    });

    next();
});