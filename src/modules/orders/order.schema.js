const Joi = require("joi");

const orderItemSchema = Joi.object({
    productId: Joi.number()
        .integer()
        .positive()
        .required(),

    quantity: Joi.number()
        .integer()
        .positive()
        .required()
});

const createOrderSchema = Joi.object({
    customer_id: Joi.number()
        .integer()
        .positive()
        .required(),

    items: Joi.array()
        .items(orderItemSchema)
        .min(1)
        .required()
});

module.exports = {
    createOrderSchema
};