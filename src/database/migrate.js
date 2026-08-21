const fs = require("fs");
const path = require("path");
const db = require("../db/database");
// const { error } = require("console");

const migrationsDir = path.join(__dirname, "migrations");

const files = fs
    .readdirSync(migrationsDir)
    .filter((file) => file.endsWith(".sql"))
    .sort();

// console.log(files);

async function getExecutedMigrations() {
    const result = await db.query("SELECT filename FROM schema_migrations ORDER BY id");

    return result.rows.map((row) => row.filename);
}

getExecutedMigrations()
    .then((migrations) => {
        console.log(migrations);
    })
    .catch((error) => {
        console.error(error);
    });