import db from "../config/db.js";

class UserModel {

    static async getByUsername(username) {

        const [rows] = await db.execute(
            "SELECT * FROM users WHERE username = ?",
            [username]
        );

        return rows[0];
    }

    static async getById(id) {

        const [rows] = await db.execute(
            "SELECT id, name, username, role FROM users WHERE id = ?",
            [id]
        );

        return rows[0];
    }

}

export default UserModel;