const db = require("../db/database");

exports.findCustomerByEmail = async (email) => {
    const result = await db.query(
        `
        SELECT *
        FROM customers
        WHERE email = $1
        `,
        [email]
    );

    return result.rows[0];
}

exports.createCustomer = async(customerData) => {

    const {
        first_name,
        last_name,
        email,
        phone
    } = customerData;

    const result = await db.query(
        `
        INSERT INTO customers
        (
            first_name,
            last_name,
            email,
            phone
        )

        VALUES($1,$2,$3,$4)

        RETURNING *
        `,
        [
            first_name,
            last_name,
            email,
            phone
        ]
    );

    return result.rows[0];
};

exports.findAllCustomers = async () => {
    const result = await db.query(
        `
        SELECT 
            id,
            first_name,
            last_name,
            email,
            phone 
        FROM customers 
        ORDER BY created_at DESC
        `
    );

    return result.rows;
};