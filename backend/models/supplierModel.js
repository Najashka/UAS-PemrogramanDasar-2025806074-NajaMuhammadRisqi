import db from "../config/db.js";

const SupplierModel = {

    async getAll() {

        const [rows] = await db.query(`
            SELECT *
            FROM suppliers
            ORDER BY id DESC
        `);

        return rows;

    },

    async getById(id) {

        const [rows] = await db.query(
            `
            SELECT *
            FROM suppliers
            WHERE id = ?
            `,
            [id]
        );

        return rows[0];

    },

    async create(data) {

        const [result] = await db.query(
            `
            INSERT INTO suppliers
            (
                name,
                phone,
                address
            )
            VALUES (?, ?, ?)
            `,
            [
                data.name,
                data.phone,
                data.address
            ]
        );

        return result;

    },

    async update(id, data) {

        const [result] = await db.query(
            `
            UPDATE suppliers
            SET
                name = ?,
                phone = ?,
                address = ?
            WHERE id = ?
            `,
            [
                data.name,
                data.phone,
                data.address,
                id
            ]
        );

        return result;

    },

    async delete(id) {

        const [result] = await db.query(
            `
            DELETE FROM suppliers
            WHERE id = ?
            `,
            [id]
        );

        return result;

    }

};

export default SupplierModel;