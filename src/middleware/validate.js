function validate(schema,source = "body") {
    return function(req, res, next) {
        const { error } = schema.validate(req[source]);
        
        if (error) {
            return next(error);
        }
        
        next();
    };
}

module.exports = validate;