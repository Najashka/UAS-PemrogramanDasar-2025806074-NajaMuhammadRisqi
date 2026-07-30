import CategoryModel from "../models/categoryModel.js";

const CategoryController = {

    async getAll(req, res) {

        try {

            const categories = await CategoryModel.getAll();

            res.json(categories);

        } catch (error) {

            res.status(500).json({
                message: error.message
            });

        }

    },

    async getById(req, res) {

        try {

            const category = await CategoryModel.getById(req.params.id);

            if (!category) {
                return res.status(404).json({
                    message: "Category tidak ditemukan"
                });
            }

            res.json(category);

        } catch (error) {

            res.status(500).json({
                message: error.message
            });

        }

    },

    async create(req, res) {

        try {

            const result = await CategoryModel.create(req.body);

            res.status(201).json({
                message: "Category berhasil ditambahkan",
                result
            });

        } catch (error) {

            res.status(500).json({
                message: error.message
            });

        }

    },

    async update(req, res) {

        try {

            const result = await CategoryModel.update(
                req.params.id,
                req.body
            );

            res.json({
                message: "Category berhasil diupdate",
                result
            });

        } catch (error) {

            res.status(500).json({
                message: error.message
            });

        }

    },

    async delete(req, res) {

        try {

            const result = await CategoryModel.delete(req.params.id);

            res.json({
                message: "Category berhasil dihapus",
                result
            });

        } catch (error) {

            res.status(500).json({
                message: error.message
            });

        }

    }

};

export async function deleteCategory(req, res) {

    try {

        await Category.delete(req.params.id);

        res.json({
            message: "Kategori berhasil dihapus"
        });

    } catch (error) {

        if (error.code === "ER_ROW_IS_REFERENCED_2") {

            return res.status(400).json({
                message: "Kategori tidak dapat dihapus karena masih digunakan oleh produk."
            });

        }

        console.error(error);

        res.status(500).json({
            message: "Internal Server Error"
        });

    }

}

export default CategoryController;