const AppError = require("./appError");

exports.validatePagination = (page, limit) => {
    if (page < 1) {
        throw new AppError(
            "Page must be greater than or equal to 1",
            400
        );
    }

    if (limit < 1) {
        throw new AppError(
            "Limit must be greater than 0",
            400
        );
    }

    if (limit > 100) {
        throw new AppError(
            "Limit cannot exceed 100",
            400
        );
    }
};