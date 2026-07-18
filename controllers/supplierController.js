import SupplierModel from "../models/supplierModel.js";

const SupplierController = {

    async getAll(req, res) {

        try {

            const suppliers = await SupplierModel.getAll();

            res.json(suppliers);

        } catch (error) {

            res.status(500).json({
                message: error.message
            });

        }

    },

    async getById(req, res) {

        try {

            const supplier = await SupplierModel.getById(req.params.id);

            if (!supplier) {

                return res.status(404).json({
                    message: "Supplier tidak ditemukan"
                });

            }

            res.json(supplier);

        } catch (error) {

            res.status(500).json({
                message: error.message
            });

        }

    },

    async create(req, res) {

        try {

            const result = await SupplierModel.create(req.body);

            res.status(201).json({
                message: "Supplier berhasil ditambahkan",
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

            const result = await SupplierModel.update(
                req.params.id,
                req.body
            );

            res.json({
                message: "Supplier berhasil diupdate",
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

            const result = await SupplierModel.delete(req.params.id);

            res.json({
                message: "Supplier berhasil dihapus",
                result
            });

        } catch (error) {

            res.status(500).json({
                message: error.message
            });

        }

    }

};

export default SupplierController;