CREATE TABLE users(

    id INT AUTO_INCREMENT PRIMARY KEY,

    name VARCHAR(100) NOT NULL,

    username VARCHAR(50) UNIQUE NOT NULL,

    password VARCHAR(255) NOT NULL,

    role ENUM('admin','cashier') NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);