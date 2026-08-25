const jwt = require("jsonwebtoken");
const AppError = require("../utils/appError");
const { findUserById } = require("../modules/users/user.repository");

async function protect(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return next(new AppError("No token provided", 401));
    }

    if (!authHeader.startsWith("Bearer ")) {
        return next(new AppError("Invalid token format", 401));
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await findUserById(decoded.id);

        if (!user) {
            return next(new AppError("User no longer exists", 402));
        }

        req.user = user;

        next();
    } catch (error) {
        next(new AppError("Invalid or expired token", 401));
    }
}

module.exports = protect;