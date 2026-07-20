import db from "../config/db.js";

const SalesModel = {

    // ===============================
    // GET ALL SALES
    // ===============================
    async getAll() {

        const [rows] = await db.query(`
            SELECT
                sales.id,
                customers.name AS customer,
                sales.sale_date,
                sales.total,
                sales.payment_method,
                sales.status
            FROM sales
            JOIN customers
                ON sales.customer_id = customers.id
            ORDER BY sales.id DESC
        `);

        return rows;

    },

    // ===============================
    // GET SALE BY ID
    // ===============================
    async getById(id) {

        const [rows] = await db.query(`
            SELECT
                sales.*,
                customers.name AS customer
            FROM sales
            JOIN customers
                ON sales.customer_id = customers.id
            WHERE sales.id = ?
        `, [id]);

        return rows[0];

    },

    // ===============================
    // CREATE SALE
    // ===============================
    async create(data) {

        const {
            customer_id,
            total,
            payment_method,
            status
        } = data;

        const [result] = await db.query(`
            INSERT INTO sales (
                customer_id,
                total,
                payment_method,
                status
            )
            VALUES (?, ?, ?, ?)
        `, [
            customer_id,
            total,
            payment_method,
            status
        ]);

        return result.insertId;

    },

    // ===============================
    // UPDATE SALE
    // ===============================
    async update(id, data) {

        const {
            customer_id,
            total,
            payment_method,
            status
        } = data;

        await db.query(`
            UPDATE sales
            SET
                customer_id = ?,
                total = ?,
                payment_method = ?,
                status = ?
            WHERE id = ?
        `, [
            customer_id,
            total,
            payment_method,
            status,
            id
        ]);

    },

    // ===============================
    // DELETE SALE
    // ===============================
    async delete(id) {

        await db.query(
            "DELETE FROM sales WHERE id = ?",
            [id]
        );

    }

};


export default SalesModel;