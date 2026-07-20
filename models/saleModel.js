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

};

export default SalesModel;