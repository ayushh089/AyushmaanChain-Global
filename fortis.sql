-- CREATE TABLE users (
--      id INT GENERATED ALWAYS AS IDENTITY (START WITH 100000 INCREMENT BY 1) PRIMARY KEY,
--     wallet_address VARCHAR(100) UNIQUE NOT NULL, -- Ethereum wallet address
--     name VARCHAR(100) NOT NULL,
--     email VARCHAR(255) UNIQUE,
--     phone VARCHAR(20),
--     role VARCHAR(20) ,
--     date_of_birth DATE,
--     gender VARCHAR(10) CHECK (gender IN ('Male', 'Female', 'Other')),
--     created_at TIMESTAMP DEFAULT NOW(),
--     updated_at TIMESTAMP DEFAULT NOW()
-- );

Select * from users;
-- delete from users;