-- ============================================================
--  SALES INVENTORY - DATABASE SCHEMA
--  Auto-generate seluruh tabel yang dibutuhkan aplikasi.
--
--  CARA PAKAI:
--  1) Docker (otomatis, direkomendasikan):
--     File ini sudah dibaca otomatis oleh docker-compose.yml
--     (folder ./database di-mount ke /docker-entrypoint-initdb.d).
--     Cukup jalankan: docker compose up -d
--     Catatan: MySQL HANYA menjalankan file init ini saat volume
--     data (mysql_data) masih kosong / pertama kali dibuat.
--     Kalau mau re-import dari nol, hapus volume-nya dulu:
--       docker compose down -v
--       docker compose up -d
--
--  2) Manual (tanpa docker / pindah ke MySQL lain):
--     mysql -u root -p < init.sql
--     atau import lewat phpMyAdmin: pilih database > tab Import
--     > pilih file init.sql > Go.
-- ============================================================

CREATE DATABASE IF NOT EXISTS sales_inventory
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE sales_inventory;

-- ============================================================
--  USERS
-- ============================================================
CREATE TABLE IF NOT EXISTS users (

    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin','cashier') NOT NULL DEFAULT 'cashier',
    status ENUM('active','inactive') NOT NULL DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

) ENGINE=InnoDB;

-- ============================================================
--  CATEGORIES
-- ============================================================
CREATE TABLE IF NOT EXISTS categories (

    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

) ENGINE=InnoDB;

-- ============================================================
--  SUPPLIERS
-- ============================================================
CREATE TABLE IF NOT EXISTS suppliers (

    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    phone VARCHAR(30),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

) ENGINE=InnoDB;

-- ============================================================
--  CUSTOMERS
-- ============================================================
CREATE TABLE IF NOT EXISTS customers (

    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    phone VARCHAR(30),
    email VARCHAR(150),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

) ENGINE=InnoDB;

-- ============================================================
--  PRODUCTS
-- ============================================================
CREATE TABLE IF NOT EXISTS products (

    id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT NOT NULL,
    supplier_id INT NOT NULL,
    name VARCHAR(150) NOT NULL,
    price DECIMAL(12,2) NOT NULL DEFAULT 0,
    stock INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_products_category
        FOREIGN KEY (category_id) REFERENCES categories(id)
        ON DELETE RESTRICT ON UPDATE CASCADE,

    CONSTRAINT fk_products_supplier
        FOREIGN KEY (supplier_id) REFERENCES suppliers(id)
        ON DELETE RESTRICT ON UPDATE CASCADE

) ENGINE=InnoDB;

-- ============================================================
--  SALES
-- ============================================================
CREATE TABLE IF NOT EXISTS sales (

    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    total DECIMAL(12,2) NOT NULL DEFAULT 0,
    payment DECIMAL(12,2) DEFAULT 0,
    change_amount DECIMAL(12,2) DEFAULT 0,
    payment_method VARCHAR(50) DEFAULT 'cash',
    status VARCHAR(50) DEFAULT 'completed',
    sale_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_sales_customer
        FOREIGN KEY (customer_id) REFERENCES customers(id)
        ON DELETE RESTRICT ON UPDATE CASCADE

) ENGINE=InnoDB;

-- ============================================================
--  SALE DETAILS
-- ============================================================
CREATE TABLE IF NOT EXISTS sale_details (

    id INT AUTO_INCREMENT PRIMARY KEY,
    sale_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    price DECIMAL(12,2) NOT NULL DEFAULT 0,
    subtotal DECIMAL(12,2) NOT NULL DEFAULT 0,

    CONSTRAINT fk_saledetails_sale
        FOREIGN KEY (sale_id) REFERENCES sales(id)
        ON DELETE CASCADE ON UPDATE CASCADE,

    CONSTRAINT fk_saledetails_product
        FOREIGN KEY (product_id) REFERENCES products(id)
        ON DELETE RESTRICT ON UPDATE CASCADE

) ENGINE=InnoDB;

-- ============================================================
--  INDEXES TAMBAHAN (mempercepat query JOIN & filter tanggal)
-- ============================================================
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_supplier ON products(supplier_id);
CREATE INDEX idx_sales_customer ON sales(customer_id);
CREATE INDEX idx_sales_date ON sales(sale_date);
CREATE INDEX idx_saledetails_sale ON sale_details(sale_id);
CREATE INDEX idx_saledetails_product ON sale_details(product_id);

-- ============================================================
--  SEED DATA
--  Akun admin default supaya bisa langsung login setelah
--  database baru diimport. SEGERA GANTI PASSWORD setelah login.
--
--  Username : admin
--  Password : admin123
-- ============================================================
INSERT INTO users (name, username, password, role, status)
VALUES (
    'Administrator',
    'admin',
    '$2b$10$S9VxDQA0RkYgI84g2WTuKen9G.D/ZBl1Jq5awJ.XFmfnxp4N9kxUi',
    'admin',
    'active'
)
ON DUPLICATE KEY UPDATE username = username;