const Joi = require("joi");

const productIdSchema = Joi.object({
    id: Joi.number()
        .integer()
        .positive()
        .required()
});

module.exports = {
    productIdSchema
};