import SaleModel from "../models/saleModel.js";
import SaleDetailModel from "../models/saleDetailModel.js";

const SalesController = {

    // ===============================
    // GET ALL SALES
    // ===============================
    async getAll(req, res) {

        try {

            const sales = await SalesModel.getAll();

            res.json(sales);

        } catch (error) {

            console.error(error);

            res.status(500).json({
                message: "Failed to get sales"
            });

        }

    },

        // ===============================
    // GET SALE BY ID
    // ===============================
    async getById(req, res) {

        try {

            const sale = await SalesModel.getById(req.params.id);

            if (!sale) {
                return res.status(404).json({
                    message: "Sale not found"
                });
            }

            const details = await SaleDetailModel.getBySaleId(req.params.id);

            res.json({
                sale,
                details
            });

        } catch (error) {

            console.error(error);

            res.status(500).json({
                message: "Failed to get sale"
            });

        }

    },

        // ===============================
    // CREATE SALE
    // ===============================
    async create(req, res) {

        try {

            const {
                sale,
                details
            } = req.body;

            const saleId = await SalesModel.create(sale);

            for (const item of details) {

                await SaleDetailModel.create({
                    sale_id: saleId,
                    product_id: item.product_id,
                    quantity: item.quantity,
                    price: item.price,
                    subtotal: item.subtotal
                });

            }

            res.status(201).json({
                message: "Sale created successfully",
                saleId
            });

        } catch (error) {

            console.error(error);

            res.status(500).json({
                message: "Failed to create sale"
            });

        }

    },

        // ===============================
    // UPDATE SALE
    // ===============================
    async update(req, res) {

        try {

            const {
                sale,
                details
            } = req.body;

            await SalesModel.update(req.params.id, sale);

            await SaleDetailModel.deleteBySaleId(req.params.id);

            for (const item of details) {

                await SaleDetailModel.create({
                    sale_id: req.params.id,
                    product_id: item.product_id,
                    quantity: item.quantity,
                    price: item.price,
                    subtotal: item.subtotal
                });

            }

            res.json({
                message: "Sale updated successfully"
            });

        } catch (error) {

            console.error(error);

            res.status(500).json({
                message: "Failed to update sale"
            });

        }

    },


        // ===============================
    // DELETE SALE
    // ===============================
    async delete(req, res) {

        try {

            await SalesModel.delete(req.params.id);

            res.json({
                message: "Sale deleted successfully"
            });

        } catch (error) {

            console.error(error);

            res.status(500).json({
                message: "Failed to delete sale"
            });

        }

    },

};

export default SalesController;