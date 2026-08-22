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

function readMigrationFile(filename) {
    const filePath = path.join(migrationsDir, filename);

    return fs.readFileSync(filePath, "utf-8")
}

async function migrate() {
    const executedMigrations = await getExecutedMigrations();

    const pendingMigrations = getPendingMigrations(files, executedMigrations);

    console.log("Pending migrations:", pendingMigrations);

    for (const migration of pendingMigrations) {
        const sql = readMigrationFile(migration);

        console.log(`Running migration: ${migration}`);

        await db.query(sql);

        await db.query(
            `
            INSERT INTO schema_migrations (filename)
            VALUES ($1)
            `,
            [migration]
        );

        console.log(`Migration completed: ${migration}`);
    }
}

migrate().catch((error) => {
    console.error(error);
});