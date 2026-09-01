const { Pool } = require("pg");

const migrationDb = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.MIGRATION_DB_USER,
    password: process.env.MIGRATION_DB_PASSWORD
});

module.exports = migrationDb;