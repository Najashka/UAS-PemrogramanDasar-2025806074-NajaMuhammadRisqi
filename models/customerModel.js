import db from "../config/db.js";

const CustomerModel = {

    async getAll() {
        const [rows] = await db.query(
            "SELECT * FROM customers ORDER BY id DESC"
        );
        return rows;
    },

    async getById(id) {
        const [rows] = await db.query(
            "SELECT * FROM customers WHERE id = ?",
            [id]
        );
        return rows[0];
    },

    async create(data) {
        const { name, phone, email, address } = data;

        const [result] = await db.query(
            `INSERT INTO customers
            (name, phone, email, address)
            VALUES (?, ?, ?, ?)`,
            [name, phone, email, address]
        );

        return result.insertId;
    },

    async update(id, data) {
        const { name, phone, email, address } = data;

        await db.query(
            `UPDATE customers
            SET
                name=?,
                phone=?,
                email=?,
                address=?
            WHERE id=?`,
            [name, phone, email, address, id]
        );
    },

    async delete(id) {
        await db.query(
            "DELETE FROM customers WHERE id=?",
            [id]
        );
    }

};

export default CustomerModel;