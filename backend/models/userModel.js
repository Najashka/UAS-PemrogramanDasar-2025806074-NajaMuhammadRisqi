import db from "../config/db.js";

const UserModel = {

    // ===============================
    // GET ALL
    // ===============================
    async getAll() {

        const [rows] = await db.query(`
            SELECT
                id,
                name,
                username,
                role,
                status,
                created_at
            FROM users
            ORDER BY id DESC
        `);

        return rows;

    },

    // ===============================
    // GET BY ID
    // ===============================
    async getById(id) {

        const [rows] = await db.query(
            `
            SELECT
                id,
                name,
                username,
                role,
                status
            FROM users
            WHERE id = ?
            `,
            [id]
        );

        return rows[0];

    },

    // ===============================
    // GET BY USERNAME
    // ===============================
    async getByUsername(username) {

        const [rows] = await db.query(
            `
            SELECT *
            FROM users
            WHERE username = ?
            LIMIT 1
            `,
            [username]
        );

        return rows[0];

    },

    // ===============================
    // CREATE
    // ===============================
    async create(data) {

        const {
            name,
            username,
            password,
            role,
            status
        } = data;

        const [result] = await db.query(
            `
            INSERT INTO users
            (
                name,
                username,
                password,
                role,
                status
            )
            VALUES (?, ?, ?, ?, ?)
            `,
            [
                name,
                username,
                password,
                role,
                status
            ]
        );

        return result.insertId;

    },

    // ===============================
    // UPDATE
    // ===============================
    async update(id, data) {

        const {
            name,
            username,
            role,
            status
        } = data;

        await db.query(
            `
            UPDATE users
            SET
                name=?,
                username=?,
                role=?,
                status=?
            WHERE id=?
            `,
            [
                name,
                username,
                role,
                status,
                id
            ]
        );

    },

    // ===============================
    // RESET PASSWORD
    // ===============================
    async resetPassword(id, password) {

        await db.query(
            `
            UPDATE users
            SET password=?
            WHERE id=?
            `,
            [
                password,
                id
            ]
        );

    },

    // ===============================
    // DELETE
    // ===============================
    async delete(id) {

        await db.query(
            "DELETE FROM users WHERE id=?",
            [id]
        );

    }

};

export default UserModel;