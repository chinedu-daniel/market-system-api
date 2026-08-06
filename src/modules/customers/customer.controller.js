const customerService = require("./customer.service");
const asyncHandler = require("../../utils/asyncHandler");

exports.registerCustomer = asyncHandler(async (req, res) => {
    const customer = await customerService.registerCustomer(req.body, req.user);

    res.status(201).json({
        message: "Customer created successfully",
        data: customer
    });
})

exports.getCustomers = asyncHandler(async (req, res) => {
    const  {
        page: pageQuery,
        limit: limitQuery,
        search,
        ...filters
    } = req.query;

    const options = {
        page: Number(pageQuery) || 1, 
        limit: Number(limitQuery) || 10,
        filters,
        search
    };

    const result = await customerService.getCustomers(options);

    res.status(200).json({
        status: "success",
        results: result.customers.length,
        pagination: result.pagination,
        data: result.customers
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