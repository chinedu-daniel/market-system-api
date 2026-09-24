CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    role VARCHAR(50) DEFAULT 'user',
    google_id VARCHAR(255),
    auth_provider VARCHAR(50) DEFAULT 'local',
    is_verified BOOLEAN DEFAULT false,
    password_reset VARCHAR(255),
    password_reset_expires TIMESTAMP,
    email_verification_token VARCHAR(255),
    email_verification_expires TIMESTAMP
);

CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price NUMERIC(12,2) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),

    CONSTRAINT products_name_unique UNIQUE (name),
    CONSTRAINT product_price_check CHECK (price >= 0),
    CONSTRAINT product_quantity_check CHECK (quantity >= 0)
);

CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER NOT NULL,
    total_amount NUMERIC(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    status VARCHAR(50) DEFAULT 'pending',

    CONSTRAINT orders_total_amount_check CHECK (total_amount >= 0),
    CONSTRAINT order_status_check CHECK (
        status IN (
            'pending',
            'confirmed',
            'processing',
            'completed',
            'cancelled'
        )
    )
);

CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    unit_price NUMERIC(12,2) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),

    CONSTRAINT order_items_order_product_unique
        UNIQUE (order_id, product_id),

    CONSTRAINT order_items_quantity_check
        CHECK (quantity > 0),

    CONSTRAINT order_items_unit_price_check
        CHECK (unit_price >= 0)
);

CREATE TABLE refresh_tokens (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    token VARCHAR(500) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT refresh_token_token_key UNIQUE (token),

    CONSTRAINT refresh_token_user_id_fkey
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

CREATE TABLE schema_migrations (
    id SERIAL PRIMARY KEY,
    filename VARCHAR(255) NOT NULL UNIQUE,
    executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ALTER TABLE orders
-- ADD CONSTRAINT fk_customer
-- FOREIGN KEY (customer_id)
-- REFERENCES customers(id);

-- ALTER TABLE order_items
-- ADD CONSTRAINT order_items_order_id_fkey
-- FOREIGN KEY (order_id)
-- REFERENCES orders(id);

-- ALTER TABLE order_items
-- ADD CONSTRAINT order_items_product_id_fkey
-- FOREIGN KEY (product_id)
-- REFERENCES products(id);