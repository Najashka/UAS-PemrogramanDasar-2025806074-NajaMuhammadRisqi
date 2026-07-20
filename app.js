import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import db from "./config/db.js";
import path from "path";
import { fileURLToPath } from "url";

import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import supplierRoutes from "./routes/supplierRoutes.js";
import customerRoutes from "./routes/customerRoutes.js";

dotenv.config();

const app = express();

// ===============================
// Konfigurasi __dirname (ES Module)
// ===============================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ===============================
// Middleware
// ===============================
app.use(cors());
app.use(express.json());

// Folder public agar CSS, JS, gambar bisa diakses
app.use(express.static(path.join(__dirname, "public")));

// ===============================
// Routes API
// ===============================
app.use("/api/categories", categoryRoutes);

app.use("/api/products", productRoutes);

app.use("/api/suppliers", supplierRoutes);

app.use("/api/customers", customerRoutes);

// ===============================
// Halaman Utama
// ===============================
app.get("/", (req, res) => {
    res.send("Sales Inventory API");
});

// ===============================
// Halaman Categories
// ===============================
app.get("/categories", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "categories.html"));
});

// ===============================
// Halaman Products
// ===============================
app.get("/products", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "products.html"));
});

// ===============================
// Halaman Suppliers
// ===============================
app.get("/suppliers", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "suppliers.html"));
});

// ===============================
// Halaman Customers
// ===============================
app.get("/customers", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "customers.html"));
});

// ===============================
// Database Connection Test
// ===============================
const PORT = process.env.PORT || 3000;

async function testDatabase() {
    try {
        const connection = await db.getConnection();
        console.log("✅ Database Connected");
        connection.release();
    } catch (error) {
        console.error("❌ Database Error");
        console.error(error.message);
    }
}

testDatabase();

// ===============================
// Jalankan Server
// ===============================
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});