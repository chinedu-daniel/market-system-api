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

exports.getAllOrders = asyncHandler(async (req, res, next) => {
    const orders = await orderService.getAllOrders();

    res.status(200).json({
        success: true,
        results: orders.length,
        data: orders
    });

    next();
});

exports.getOrderById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    const order = await orderService.getOrderById(id);

    res.status(200).json({
        success: true,
        data: order
    });
});