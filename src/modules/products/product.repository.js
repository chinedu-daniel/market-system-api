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
    client,
    name,
    description,
    price,
    quantity
}) => {
    const result = await client.query(
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
            is_active,
            created_at,
            updated_at
        FROM products
        WHERE id = $1
        `,
        [id]
    );

    return result.rows[0];
};

exports.updateProduct = async (id, updates) => {
    const allowedFields = [
        "name",
        "description",
        "price",
        "quantity"
    ];

    const fields = [];
    const values = [];

    for (const field of allowedFields) {
        if (updates[field] !== undefined) {
            values.push(updates[field]);
            fields.push(`${field} = $${values.length}`);
        }
    }

    values.push(id);

    const result = await db.query(
        `
        UPDATE products
        SET ${fields.join(", ")},
            updated_at = NOW()
        WHERE id = $${values.length}
        RETURNING
            id,
            name,
            description,
            price,
            quantity,
            created_at,
            updated_at
        `,
        values
    );

    return result.rows[0];
};

exports.deleteProduct = async (id) => {
    const result = await db.query(
        `
        UPDATE products
        SET is_active = false,
            updated_at = NOW()
        WHERE id = $1
        RETURNING
            id,
            name,
            description,
            price,
            quantity,
            is_active,
            created_at,
            updated_at
        `,
        [id]
    );

    return result.rows[0];
};

exports.findProductForUpdate = async ({
    client,
    productId
}) => {
    const result = await client.query(
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
        FOR UPDATE
        `,
        [productId]
    );

    return result.rows[0];
};

exports.reduceStock = async ({
    client,
    productId,
    quantity
}) => {
    const result = await client.query(
        `
        UPDATE products
        SET quantity = quantity - $1,
            updated_at = NOW()
        WHERE id = $2
            AND quantity >= $1
        RETURNING 
            id,
            name,
            quantity,
            updated_at
        `,
        [quantity, productId]
    );

    return result.rows[0];
};