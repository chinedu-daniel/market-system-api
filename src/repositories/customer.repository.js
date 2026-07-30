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

exports.createCustomer = async (customerData) => {

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

exports.findAllCustomers = async (limit, offset) => {
    const result = await db.query(
        `
        SELECT 
            id,
            first_name,
            last_name,
            email,
            phone,
            created_at,
            updated_at 
        FROM customers 
        ORDER BY created_at DESC
        LIMIT $1
        OFFSET $2
        `,
        [limit, offset]
    );

    return result.rows;
};

exports.findCustomerById = async (id) => {
    const result = await db.query(
        `
        SELECT 
            id,
            first_name,
            last_name,
            email,
            phone,
            created_at,
            updated_at
            FROM customers
            WHERE id = $1
        `,
        [id]
    );

    return result.rows[0];
};

exports.updateCustomer = async (id, customerData) => {
    const allowedFields = [
        "first_name",
        "last_name",
        "email",
        "phone"
    ];
    
    const updates = [];
    const values = [];

    allowedFields.forEach((field) => {
        if (customerData[field] !== undefined) {
            updates.push(`${field} = $${values.length + 1}`);
            values.push(customerData[field]);
        }
    });

    values.push(id);
    
    const query = `
        UPDATE customers
        SET ${updates.join(", ")}
        WHERE id = $${values.length}
        RETURNING
            id,
            first_name,
            last_name,
            email,
            phone,
            created_at,
            updated_at;
    `;

    const result = await db.query(query, values);

    return result.rows[0];
};

exports.deleteCustomer = async (id) => {
    const result = await db.query(
        `
        DELETE FROM customers
        WHERE id =$1
        RETURNING *
        `,
        [id]
    );

    return result.rows[0]
};

exports.countCustomers = async () => {
    const result = await db.query(
        `
        SELECT COUNT(*) AS total
        FROM customers
        `
    );

    return Number(result.rows[0].total);
};