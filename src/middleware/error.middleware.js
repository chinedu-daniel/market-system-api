module.exports = (err, req, res) => {
    if (process.env.NODE_ENV === "development") {
        console.error(err);
    } else {
        console.error("Application error:", err.message);
    }

    let statusCode = err.statusCode || 500;

    if (err.name === "ValidationError") {
        statusCode = 400;
    }

    res.status(statusCode).json({
        message: err.message  || "Internal Server Error"
    });
};