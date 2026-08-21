const fs = require("fs");
const path = require("path");

const migrationsDir = path.join(__dirname, "migrations");

const files = fs
    .readdirSync(migrationsDir)
    .filter((file) => file.endsWith(".sql"))
    .sort();

console.log(files);