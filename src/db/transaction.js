const db = require("./database");

const withTransaction = async (callback) => {
    const client = await db.connect();

    try {
        await client.query("BEGIN");

        const result = await callback(client);

        await client.query("COMMIT");

        return result;
    } catch (error) {
        await client.query("ROLLBACK");

        throw error;
    } finally {
        client.release();
    }
};

module.exports = withTransaction;