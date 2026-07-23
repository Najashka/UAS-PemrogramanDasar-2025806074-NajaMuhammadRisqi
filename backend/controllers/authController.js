import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import UserModel from "../models/userModel.js";

class AuthController {

    static async login(req, res) {

        try {

            const { username, password } = req.body;

            if (!username || !password) {
                return res.status(400).json({
                    message: "Username dan password wajib diisi"
                });
            }

            const user = await UserModel.getByUsername(username);

            if (!user) {
                return res.status(401).json({
                    message: "Username atau password salah"
                });
            }

            const match = await bcrypt.compare(password, user.password);

            if (!match) {
                return res.status(401).json({
                    message: "Username atau password salah"
                });
            }

            const token = jwt.sign(
                {
                    id: user.id,
                    role: user.role
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: "8h"
                }
            );

            res.json({
                message: "Login berhasil",
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    username: user.username,
                    role: user.role
                }
            });

        } catch (error) {

            console.error(error);

            res.status(500).json({
                message: "Internal Server Error"
            });

        }

    }

}

export default AuthController;