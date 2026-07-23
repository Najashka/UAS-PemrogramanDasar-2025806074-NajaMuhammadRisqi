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
import saleRoutes from "./routes/saleRoutes.js";
import authRoutes from "./routes/authRoutes.js";

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

// ===============================
// Static Frontend
// ===============================
// Folder frontend berada di luar folder backend
app.use(express.static(path.join(__dirname, "../frontend")));

// ===============================
// Routes API
// ===============================
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/suppliers", supplierRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/sales", saleRoutes);
app.use("/api/auth", authRoutes);

// ===============================
// Entry Point Aplikasi
// ===============================
app.get("/", (req, res) => {

    res.sendFile(path.join(__dirname, "../frontend/index.html"));

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