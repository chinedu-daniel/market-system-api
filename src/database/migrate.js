require("dotenv").config();
const fs = require("fs");
const path = require("path");
const db = require("../db/migration-database");

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

        const client = await db.connect();

        try {
            await client.query("BEGIN");
            await client.query(sql);
            await client.query(
                "INSERT INTO schema_migrations (filename) VALUES ($1)",
                [migration] 
            );
            await client.query("COMMIT");
            console.log(`Migration completed: ${migration}`);
        } catch (error) {
            await client.query("ROLLBACK");
            console.error(`Migration failed and was rolled backed: ${migration}`);
            throw error;
        } finally {
            client.release();
        }

        // await db.query(sql);

        // await db.query(
        //     `
        //     INSERT INTO schema_migrations (filename)
        //     VALUES ($1)
        //     `,
        //     [migration]
        // );

        // console.log(`Migration completed: ${migration}`);
    }
}

migrate().catch((error) => {
    console.error(error);
    process.exitCode = 1;
}).finally(() => db.end());