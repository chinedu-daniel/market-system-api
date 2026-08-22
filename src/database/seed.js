const db = require("../db/database");

async function seed() {
    console.log("Starting seed...");

    await db.query(
        `
        INSERT INTO products (
            name,
            description,
            price,
            quantity
        )
        VALUES
            ('Toyota Corolla Engine', '1.8L petrol engine', 850000, 5),
            ('Honda Accord Gearbox', 'Automatic transmission', 650000, 3),
            ('Toyota Camry Engine', '2.5L petrol engine', 1200000, 4)
        
        ON CONFLICT (name) DO NOTHING;   
        `
    );

    console.log("Seed completed.");
}

seed()
    .catch((error) => {
        console.error(error);
    });