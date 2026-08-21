const fs = require("fs");
const path = require("path");
const db = require("../db/database");

const migrationsDir = path.join(__dirname, "migrations");

const files = fs
    .readdirSync(migrationsDir)
    .filter((file) => file.endsWith(".sql"))
    .sort();

async function getExecutedMigrations() {
    const result = await db.query(
        "SELECT filename FROM schema_migrations ORDER BY id"
    );

    return result.rows.map((row) => row.filename);
}

function getPendingMigrations(files, executedMigrations) {
    return files.filter((file) => !executedMigrations.includes(file));
}

async function migrate() {
    const executedMigrations = await getExecutedMigrations();

    const pendingMigrations = getPendingMigrations(files, executedMigrations);

    console.log("Pending migrations:", pendingMigrations);
}

migrate().catch((error) => {
    console.error(error);
});