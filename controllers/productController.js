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

    }

};

export default ProductController;