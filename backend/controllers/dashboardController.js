import DashboardModel from "../models/dashboardModel.js";

const DashboardController = {

    async getDashboard(req, res) {

        try {

            const stats =
                await DashboardModel.getStats();

            const weeklySales =
                await DashboardModel.getWeeklySales();

            const bestProducts =
                await DashboardModel.getBestProducts();
                
            const recentSales =
                await DashboardModel.getRecentSales();

            res.json({

                ...stats,

                weeklySales,

                bestProducts,

                recentSales

            });

        } catch (error) {

            console.error(error);

            res.status(500).json({

                message: "Failed to load dashboard"

            });

        }

    }

};

export default DashboardController;