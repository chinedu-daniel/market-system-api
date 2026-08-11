const Joi = require("joi");

const productIdSchema = Joi.object({
    id: Joi.number()
        .integer()
        .positive()
        .required()
});

const productUpdateSchema = Joi.object({
    name: Joi.string().trim().min(1),
    description: Joi.string().trim().min(1),
    price: Joi.number().positive(),
    quantity: Joi.number().integer().min(0)
}).min(1);

module.exports = {
    productIdSchema,
    productUpdateSchema
};