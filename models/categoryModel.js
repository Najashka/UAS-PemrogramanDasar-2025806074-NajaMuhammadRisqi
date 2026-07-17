import db from "../config/db.js";

const CategoryModel = {

    async getAll() {

        const [rows] = await db.query(`
            SELECT *
            FROM categories
            ORDER BY id DESC
        `);

        return rows;

    },

    async getById(id) {

        const [rows] = await db.query(
            `
            SELECT *
            FROM categories
            WHERE id = ?
            `,
            [id]
        );

        return rows[0];

    },

    async create(data) {

        const [result] = await db.query(
            `
            INSERT INTO categories (name)
            VALUES (?)
            `,
            [data.name]
        );

        return result;

    },

    async update(id, data) {

        const [result] = await db.query(
            `
            UPDATE categories
            SET name = ?
            WHERE id = ?
            `,
            [data.name, id]
        );

        return result;

    },

    async delete(id) {

        const [result] = await db.query(
            `
            DELETE FROM categories
            WHERE id = ?
            `,
            [id]
        );

        return result;

    }

};

export default CategoryModel;