import ProductModel from "../models/productModel.js";

const ProductController = {

    async getAll(req, res) {

        try {

            const products = await ProductModel.getAll();

            res.json(products);

        } catch (error) {

            res.status(500).json({
                message: error.message
            });

        }

    },

    async getById(req, res) {

        try {

            const product = await ProductModel.getById(req.params.id);

            if (!product) {

                return res.status(404).json({
                    message: "Product tidak ditemukan"
                });

            }

            res.json(product);

        } catch (error) {

            res.status(500).json({
                message: error.message
            });

        }

    },

    async create(req, res) {

        try {

            const result = await ProductModel.create(req.body);

            res.status(201).json({
                message: "Product berhasil ditambahkan",
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

            const result = await ProductModel.update(
                req.params.id,
                req.body
            );

            res.json({
                message: "Product berhasil diupdate",
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

            const result = await ProductModel.delete(req.params.id);

            res.json({
                message: "Product berhasil dihapus",
                result
            });

        } catch (error) {

            res.status(500).json({
                message: error.message
            });

        }

    }

};

export default ProductController;