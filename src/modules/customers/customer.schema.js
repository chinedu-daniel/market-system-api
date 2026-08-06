const Joi = require("joi");

const registerCustomerSchema = Joi.object({
    first_name: Joi.string()
        .trim()
        .min(2)
        .max(50)
        .required(),

    last_name: Joi.string()
        .trim()
        .min(2)
        .max(50)
        .required(),

    email: Joi.string()
        .trim()
        .email()
        .required(),

    phone: Joi.string()
        .trim()
        .min(10)
        .max(20)
        .required()
});

module.exports = {
    registerCustomerSchema
};