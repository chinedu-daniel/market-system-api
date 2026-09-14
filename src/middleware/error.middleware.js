module.exports = (err, req, res, next) => {
    if (process.env.NODE_ENV === "development") {
        console.log(err);
    } else {
        console.error("Application error:", err.message);
    }

    const statusCode = err.statusCode || 500;

    res.status(statusCode).json({
        message: err.message  || "Internal Server Error"
    });
};