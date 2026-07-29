require("dotenv").config();

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