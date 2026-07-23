import db from "../config/db.js";

class UserModel {

    static async getByUsername(username){

        const [rows] = await db.query(

            "SELECT * FROM users WHERE username=?",

            [username]

        );

        return rows[0];

    }

}

export default UserModel;