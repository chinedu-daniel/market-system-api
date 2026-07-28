const db = require("../db/database");

exports.findCustomerByEmail = async (email) => {
    const result = await db.query(
        `
        SELECT 
        `
    );
}

exports.createCustomer = async(customerData) => {
    const query = `
        INSERT INTO customers
        (first_name,last_name,email,phone)
        VALUES($1,$2,$3,$4)
        RETURNING *
    `;

    const values = Object.values(customer);

    const result = await db.query(query, values);

    return result.rows[0];
}