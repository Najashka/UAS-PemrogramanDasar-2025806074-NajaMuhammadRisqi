import db from "../config/db.js";

const ReportModel = {

    // ===============================
    // GET REPORT
    // ===============================
    async getReport(startDate, endDate) {

        const [rows] = await db.query(`

            SELECT

                sales.id,

                customers.name AS customer,

                sales.sale_date,

                sales.total,

                sales.payment_method,

                sales.status,

                SUM(sale_details.quantity) AS total_item

            FROM sales

            JOIN customers
                ON sales.customer_id = customers.id

            JOIN sale_details
                ON sales.id = sale_details.sale_id

            WHERE DATE(sales.sale_date)
            BETWEEN ? AND ?

            GROUP BY sales.id

            ORDER BY sales.sale_date DESC

        `, [

            startDate,

            endDate

        ]);

        return rows;

    }

};

export default ReportModel;