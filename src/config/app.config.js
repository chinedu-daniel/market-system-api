require("dotenv").config();

module.exports = {
    appUrl:
        process.env.APP.URL || 
        "http://localhost:3000",

    // frontendUrl:
    //     process.env.FRONTEND_URL ||
    //     "http://localhost:5173"
};