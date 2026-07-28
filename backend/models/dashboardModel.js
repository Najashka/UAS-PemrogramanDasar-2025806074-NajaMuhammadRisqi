import db from "../config/db.js";

const DashboardModel = {

    // ===============================
    // GET DASHBOARD STATS
    // ===============================
    async getStats() {

        // Total penjualan hari ini
        const [[todaySales]] = await db.query(`
            SELECT
                COALESCE(SUM(total), 0) AS total
            FROM sales
            WHERE DATE(sale_date) = CURDATE()
        `);

        // Total transaksi hari ini
        const [[todayTransactions]] = await db.query(`
            SELECT
                COUNT(*) AS total
            FROM sales
            WHERE DATE(sale_date) = CURDATE()
        `);

        // Total produk
        const [[products]] = await db.query(`
            SELECT
                COUNT(*) AS total
            FROM products
        `);

        // Total customer
        const [[customers]] = await db.query(`
            SELECT
                COUNT(*) AS total
            FROM customers
        `);

        return {

            todaySales: todaySales.total,

            todayTransactions: todayTransactions.total,

            totalProducts: products.total,

            totalCustomers: customers.total

        };

    },

    // ===============================
    // WEEKLY SALES
    // ===============================

    async getWeeklySales() {

        const [rows] = await db.query(`

            SELECT

                DATE(sale_date) AS date,

                SUM(total) AS total

            FROM sales

            WHERE sale_date >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)

            GROUP BY DATE(sale_date)

            ORDER BY DATE(sale_date)

        `);

        return rows;

    },

    // ===============================
    // BEST SELLING PRODUCTS
    // ===============================

    async getBestProducts() {

        const [rows] = await db.query(`

            SELECT

                products.name,

                SUM(sale_details.quantity) AS sold

            FROM sale_details

            JOIN products
                ON sale_details.product_id = products.id

            GROUP BY products.id

            ORDER BY sold DESC

            LIMIT 5

        `);

        return rows;

    },

    // ===============================
    // RECENT SALES
    // ===============================

    async getRecentSales() {

        const [rows] = await db.query(`
            SELECT
                sales.id,
                customers.name AS customer,
                sales.total,
                sales.sale_date
            FROM sales
            JOIN customers
                ON sales.customer_id = customers.id
            ORDER BY sales.id DESC
            LIMIT 5
        `);

        return rows;

    }

};


export default DashboardModel;