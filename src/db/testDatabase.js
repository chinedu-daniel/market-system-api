const pool = require("./database");

async function testDatabase() {
    try {
        const result = await pool.query("SELECT NOW()");

        console.log(result.rows);

        console.log("Database connected successfully");
    } catch (error) {
        console.error("Database connection failed");
        console.error(error.message);
    }
}

testDatabase();