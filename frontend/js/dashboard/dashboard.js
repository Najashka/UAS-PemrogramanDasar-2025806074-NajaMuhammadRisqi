import { requireAuth } from "../auth/guard.js";
import { renderLayout } from "../layout/layout.js";

requireAuth("admin");

renderLayout("Dashboard", `

<div class="dashboard-cards">

    <div class="card">

        <h3>Total Product</h3>

        <h2 id="totalProduct">0</h2>

    </div>

    <div class="card">

        <h3>Total Customer</h3>

        <h2 id="totalCustomer">0</h2>

    </div>

    <div class="card">

        <h3>Total Supplier</h3>

        <h2 id="totalSupplier">0</h2>

    </div>

    <div class="card">

        <h3>Sales Today</h3>

        <h2 id="salesToday">Rp 0</h2>

    </div>

</div>

<div class="table-card">

    <h3>Recent Transactions</h3>

    <br>

    <table width="100%">

        <thead>

            <tr>

                <th>ID</th>

                <th>Customer</th>

                <th>Total</th>

            </tr>

        </thead>

        <tbody id="recentSales">

            <tr>

                <td colspan="3">

                    Belum ada transaksi

                </td>

            </tr>

        </tbody>

    </table>

</div>

`);



async function loadDashboard() {

    try {

        const [
            products,
            customers,
            suppliers,
            sales
        ] = await Promise.all([

            fetch("/api/products").then(res => res.json()),
            fetch("/api/customers").then(res => res.json()),
            fetch("/api/suppliers").then(res => res.json()),
            fetch("/api/sales").then(res => res.json())

        ]);

        document.getElementById("totalProduct").textContent =
            products.length;

        document.getElementById("totalCustomer").textContent =
            customers.length;

        document.getElementById("totalSupplier").textContent =
            suppliers.length;

        const today = new Date().toISOString().split("T")[0];

        const todaySales = sales.filter(sale =>
            sale.sale_date.startsWith(today)
        );

        const total = todaySales.reduce((sum, sale) =>
            sum + Number(sale.total_amount), 0);

        document.getElementById("salesToday").textContent =
            "Rp " + total.toLocaleString("id-ID");

    } catch (err) {

        console.error(err);

    }

}

loadDashboard();