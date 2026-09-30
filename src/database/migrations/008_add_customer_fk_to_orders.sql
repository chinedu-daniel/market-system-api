ALTER TABLE orders DROP CONSTRAINT IF EXISTS fk_customer;

ALTER TABLE orders
ADD CONSTRAINT fk_customer
FOREIGN KEY (customer_id)
REFERENCES customers(id);