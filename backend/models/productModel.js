import db from "../config/db.js";

const ProductModel = {

    async getAll() {

        const [rows] = await db.query(`
            SELECT
                products.id,
                products.name,
                products.price,
                products.stock,
                categories.name AS category,
                suppliers.name AS supplier
            FROM products
            JOIN categories
                ON products.category_id = categories.id
            JOIN suppliers
                ON products.supplier_id = suppliers.id
            ORDER BY products.id DESC
        `);

        return rows;

    },

    async getById(id) {

        const [rows] = await db.query(
            `
            SELECT *
            FROM products
            WHERE id = ?
            `,
            [id]
        );

        return rows[0];

    },

    async create(data) {

        const [result] = await db.query(
            `
            INSERT INTO products
            (
                category_id,
                supplier_id,
                name,
                price,
                stock
            )
            VALUES (?, ?, ?, ?, ?)
            `,
            [
                data.category_id,
                data.supplier_id,
                data.name,
                data.price,
                data.stock
            ]
        );

        return result;

    },

    async update(id, data) {

        const [result] = await db.query(
            `
            UPDATE products
            SET
                category_id = ?,
                supplier_id = ?,
                name = ?,
                price = ?,
                stock = ?
            WHERE id = ?
            `,
            [
                data.category_id,
                data.supplier_id,
                data.name,
                data.price,
                data.stock,
                id
            ]
        );

        return result;

    },

    async delete(id) {

        const [result] = await db.query(
            `
            DELETE FROM products
            WHERE id = ?
            `,
            [id]
        );

        return result;

    }

};

export default ProductModel;