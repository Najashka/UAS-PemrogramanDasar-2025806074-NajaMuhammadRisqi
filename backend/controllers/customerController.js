import CustomerModel from "../models/customerModel.js";

const CustomerController = {

    async getAll(req, res) {
        try {
            const customers = await CustomerModel.getAll();
            res.json(customers);
        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: "Failed to get customers"
            });
        }
    },

    async getById(req, res) {
        try {
            const customer = await CustomerModel.getById(req.params.id);

            if (!customer) {
                return res.status(404).json({
                    message: "Customer not found"
                });
            }

            res.json(customer);
        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: "Failed to get customer"
            });
        }
    },

    async create(req, res) {
        try {
            const id = await CustomerModel.create(req.body);

            res.status(201).json({
                message: "Customer created successfully",
                id
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: "Failed to create customer"
            });
        }
    },

    async update(req, res) {
        try {
            await CustomerModel.update(req.params.id, req.body);

            res.json({
                message: "Customer updated successfully"
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: "Failed to update customer"
            });
        }
    },

    async delete(req, res) {
        try {
            await CustomerModel.delete(req.params.id);

            res.json({
                message: "Customer deleted successfully"
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: "Failed to delete customer"
            });
        }
    }

};

export default CustomerController;