const db = require("../../db/database");

exports.findProductByName = async (name) => {
    const result = await db.query(
        `
        SELECT
            id,
            name,
            description,
            price,
            quantity,
            created_at,
            updated_at
        FROM products
        WHERE name = $1
        `,
        [name]
    );

    return result.rows[0];
};

exports.createProduct = async ({ 
    name,
    description,
    price,
    quantity
}) => {
    const result = await db.query(
        `
        INSERT INTO products (
            name,
            description,
            price,
            quantity
        )
        VALUES ($1, $2, $3, $4)
        RETURNING 
            id,
            name,  
            description,
            price,
            quantity,
            created_at,
            updated_at 
       `,
       [name, description, price, quantity]    
    );

    return result.rows[0];
};

exports.findAllProducts = async (limit, offset, filters = {}, sort = "newest") => {

    const allowedSorts = {
        newest: "created_at DESC",
        oldest: "created_at ASC",
        price_desc: "PRICE DESC",
        price_asc: "PRICE ASC",
        name_asc: "NAME ASC",
        name_desc: "NAME_DESC"
    };

    const allowedFields = [
        "name",
        "minPrice",
        "maxPrice"
    ];

    const conditions = [];
    const values = [];

    for (const field of allowedFields) {
        if (filters[field]) {
            values.push(filters[field]);

            if (field === "name") {
                conditions.push(`name = $${values.length}`);
            }

            if (field === "minPrice") {
                conditions.push(`price >= $${values.length}`);
            }

            if (field === "maxPrice") {
                conditions.push(`price <= $${values.length}`);
            }
        }
    };

    if (filters.search) {
        values.push(`%${filters.search}%`);

        conditions.push(`
            (
                name ILIKE $${values.length}
                OR description ILIKE $${values.length}
            )
        `);
    }

    const whereClause = 
        conditions.length > 0 
        ? `WHERE ${conditions.join(" AND ")}` 
        : "";

    const orderBy = allowedSorts[sort] || allowedSorts.newest;

    values.push(limit);
    const limitPlaceholder = `$${values.length}`;

    values.push(offset);
    const offsetPlaceholder = `$${values.length}`;

    const result = await db.query(
        `
        SELECT 
            id,
            name,
            description,
            price,
            quantity,
            created_at,
            updated_at
        FROM products
        ${whereClause}
        ORDER BY ${orderBy}
        LIMIT ${limitPlaceholder}
        OFFSET ${offsetPlaceholder}
        `,
        values
    );

    return result.rows;
};

exports.countProducts = async(filters = {}) => {
    const allowedFields = [
        "name",
        "minPrice",
        "maxPrice"
    ];

    const conditions = [];
    const values = [];

    if (filters.search) {
        values.push(`%${filters.search}%`);

        conditions.push(`
            (
                name ILIKE $${values.length}
                OR description ILIKE $${values.length}
            )
        `);
    }

    for (const field of allowedFields) {
        if (filters[field]) {
            values.push(filters[field]);

            if (field === "name"){
                conditions.push(`name = $${values.length}`);
            }

            if (field === "minPrice"){
                conditions.push(`price >= $${values.length}`);
            }

            if (field === "maxPrice"){
                conditions.push(`price <= $${values.length}`);
            }
        }
    }

    const whereClause = 
        conditions.length > 0 ?  
        `WHERE ${conditions.join(" AND ")}` 
        : "";


    console.log("COUNT INPUT:", {
        filters
    });

    console.log("COUNT WHERE:", whereClause);
    console.log("COUNT VALUES:", values);
    
    const result = await db.query(
        `
        SELECT COUNT(*) AS total
        FROM products
        ${whereClause}
        `,
        values
    );

    return Number(result.rows[0].total);
};

exports.findProductById = async (id) => {
    const result = await db.query(
        `
        SELECT 
            id,
            name,
            description,
            price,
            quantity,
            created_at,
            updated_at
        FROM products
        WHERE id = $1
        `,
        [id]
    );

    return result.rows[0];
};