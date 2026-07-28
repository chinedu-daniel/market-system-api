function validate(schema) {
    return function(req, res, next) {
        const { error } = schema.validate(req.body);
        
        if (error) {
            const error = new Error("Email is required");
            return next(error);
        }
        
        next();
    };
}

module.exports = validate;