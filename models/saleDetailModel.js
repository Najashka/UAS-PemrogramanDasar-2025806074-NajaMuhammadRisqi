import db from "../config/db.js";

const SaleDetailModel = {

    // ===============================
    // GET SALE DETAILS BY SALE ID
    // ===============================
    async getBySaleId(saleId) {

        const [rows] = await db.query(`
            SELECT
                sale_details.id,
                sale_details.sale_id,
                sale_details.product_id,
                products.name AS product_name,
                sale_details.quantity,
                sale_details.price,
                sale_details.subtotal
            FROM sale_details
            JOIN products
                ON sale_details.product_id = products.id
            WHERE sale_details.sale_id = ?
        `, [saleId]);

        return rows;

    },

    // ===============================
    // CREATE SALE DETAIL
    // ===============================
    async create(data) {

        const {
            sale_id,
            product_id,
            quantity,
            price,
            subtotal
        } = data;

        const [result] = await db.query(`
            INSERT INTO sale_details (
                sale_id,
                product_id,
                quantity,
                price,
                subtotal
            )
            VALUES (?, ?, ?, ?, ?)
        `, [
            sale_id,
            product_id,
            quantity,
            price,
            subtotal
        ]);

        return result.insertId;

    },

    // ===============================
    // DELETE SALE DETAILS BY SALE ID
    // ===============================
    async deleteBySaleId(saleId) {

        await db.query(
            "DELETE FROM sale_details WHERE sale_id = ?",
            [saleId]
        );

    },
};

export default SaleDetailModel;