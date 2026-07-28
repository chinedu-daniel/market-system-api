require("dotenv").config();

// console.log({
//     DB_HOST: process.env.DB_HOST,
//     DB_PORT: process.env.DB_PORT,
//     DB_NAME: process.env.DB_NAME,
//     DB_USER: process.env.DB_USER,
//     DB_PASSWORD_TYPE: typeof process.env.DB_PASSWORD,
//     DB_PASSWORD_EXISTS: !!process.env.DB_PASSWORD,
// });

const app = require("./app");
const db = require("./db/database");

const PORT = process.env.PORT || 3000;

async function startServer() {
    try{
        await db.query("SELECT NOW()");

        console.log("Database connected successfully");

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`)
        });
    } catch(error) {
        console.error("Failed to connect to database");
        console.error(error.message);

        process.exit(1);
    }
}

startServer();