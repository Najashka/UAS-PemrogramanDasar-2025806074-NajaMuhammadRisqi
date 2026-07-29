import bcrypt from "bcrypt";
import UserModel from "../models/userModel.js";

const UserController = {

    // ===============================
    // GET ALL
    // ===============================
    async getAll(req, res) {

        try {

            const users = await UserModel.getAll();

            res.json(users);

        } catch (error) {

            console.error(error);

            res.status(500).json({
                message: "Failed to get users"
            });

        }

    },

    // ===============================
    // GET BY ID
    // ===============================
    async getById(req, res) {

        try {

            const user = await UserModel.getById(req.params.id);

            if (!user) {

                return res.status(404).json({
                    message: "User not found"
                });

            }

            res.json(user);

        } catch (error) {

            console.error(error);

            res.status(500).json({
                message: "Failed to get user"
            });

        }

    },

    // ===============================
    // CREATE
    // ===============================
    async create(req, res) {

        try {

            const {
                name,
                username,
                password,
                role,
                status
            } = req.body;

            if (!name || !username || !password) {

                return res.status(400).json({
                    message: "Data belum lengkap"
                });

            }

            const users = await UserModel.getAll();

            const exist = users.find(
                user => user.username === username
            );

            if (exist) {

                return res.status(400).json({
                    message: "Username sudah digunakan"
                });

            }

            const hashedPassword =
                await bcrypt.hash(password, 10);

            const id = await UserModel.create({

                name,
                username,
                password: hashedPassword,
                role,
                status

            });

            res.status(201).json({

                message: "User berhasil ditambahkan",

                id

            });

        } catch (error) {

            console.error(error);

            res.status(500).json({

                message: "Failed to create user"

            });

        }

    },

    // ===============================
    // UPDATE
    // ===============================
    async update(req, res) {

        try {

            await UserModel.update(

                req.params.id,

                req.body

            );

            res.json({

                message: "User updated successfully"

            });

        } catch (error) {

            console.error(error);

            res.status(500).json({

                message: "Failed to update user"

            });

        }

    },

    // ===============================
    // RESET PASSWORD
    // ===============================
    async resetPassword(req, res) {

        try {

            const password =
                await bcrypt.hash("123456", 10);

            await UserModel.resetPassword(

                req.params.id,

                password

            );

            res.json({

                message: "Password berhasil direset"

            });

        } catch (error) {

            console.error(error);

            res.status(500).json({

                message: "Failed to reset password"

            });

        }

    },

    // ===============================
    // DELETE
    // ===============================
    async delete(req, res) {

        try {

            await UserModel.delete(req.params.id);

            res.json({

                message: "User deleted successfully"

            });

        } catch (error) {

            console.error(error);

            res.status(500).json({

                message: "Failed to delete user"

            });

        }

    }

};

export default UserController;