require("dotenv").config();

const cleanupExpiredSessions = require("./jobs/sessionCleanup");

const app = require("./app");
const db = require("./db/database");

const PORT = process.env.PORT || 3000;

cleanupExpiredSessions(); // Run the session cleanup job on server start

setInterval(cleanupExpiredSessions,
    60 * 60 * 1000
);

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