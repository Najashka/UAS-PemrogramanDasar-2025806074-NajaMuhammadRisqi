import { requireAuth } from "../auth/guard.js";
import { renderLayout } from "../layout/layout.js";
import { apiFetch } from "../api/api.js";

requireAuth("admin");

renderLayout("Dashboard", `

<div class="dashboard">

    <div class="dashboard-header">

        <h2>Dashboard</h2>

        <p>Selamat datang di Sales Inventory System</p>

    </div>

    <div class="dashboard-cards">

        <div class="dashboard-card">

            <div class="card-icon sales">
                <i class="fa-solid fa-wallet"></i>
            </div>

            <div>

                <h4>Penjualan Hari Ini</h4>

                <h2 id="todaySales">
                    Rp0
                </h2>

            </div>

        </div>

        <div class="dashboard-card">

            <div class="card-icon transaction">
                <i class="fa-solid fa-receipt"></i>
            </div>

            <div>

                <h4>Transaksi Hari Ini</h4>

                <h2 id="todayTransactions">
                    0
                </h2>

            </div>

        </div>

        <div class="dashboard-card">

            <div class="card-icon product">
                <i class="fa-solid fa-box"></i>
            </div>

            <div>

                <h4>Total Produk</h4>

                <h2 id="totalProducts">
                    0
                </h2>

            </div>

        </div>

        <div class="dashboard-card">

            <div class="card-icon customer">
                <i class="fa-solid fa-users"></i>
            </div>

            <div>

                <h4>Total Customer</h4>

                <h2 id="totalCustomers">
                    0
                </h2>

            </div>

        </div>

    </div>

    <div class="chart-card">

        <h3>

            Penjualan 7 Hari Terakhir

        </h3>

        <canvas id="salesChart"></canvas>

    </div>
    <div class="dashboard-bottom">
        <div class="best-product-card">

            <h3>

                <i class="fa-solid fa-trophy"></i>

                Produk Terlaris

            </h3>

            <div id="bestProducts">

            </div>

        </div>

        <div class="recent-sales-card">

            <h3>

                <i class="fa-solid fa-clock-rotate-left"></i>

                Transaksi Terbaru

            </h3>

            <div id="recentSales"></div>

        </div>
    </div>
</div>

`);

const todaySales =
    document.getElementById("todaySales");

const todayTransactions =
    document.getElementById("todayTransactions");

const totalProducts =
    document.getElementById("totalProducts");

const totalCustomers =
    document.getElementById("totalCustomers");

const bestProducts =
    document.getElementById("bestProducts");
    
const recentSales =
    document.getElementById("recentSales");

loadDashboard();

async function loadDashboard() {

    try {

        const response =
            await apiFetch("/api/dashboard");

        if (!response) return;

        const data =
            await response.json();

        renderChart(data.weeklySales);
        renderBestProducts(data.bestProducts);
        renderRecentSales(data.recentSales);

        if (!response.ok) {

            throw new Error(
                data.message
            );

        }

        todaySales.textContent =
            formatRupiah(data.todaySales);

        todayTransactions.textContent =
            data.todayTransactions;

        totalProducts.textContent =
            data.totalProducts;

        totalCustomers.textContent =
            data.totalCustomers;

    } catch (error) {

        console.error(error);

    }

}

function renderChart(weeklySales){

    const labels = weeklySales.map(item =>

        new Date(item.date).toLocaleDateString(

            "id-ID",

            {

                day:"2-digit",

                month:"short"

            }

        )

    );

    const totals = weeklySales.map(item =>

        Number(item.total)

    );

    new Chart(

        document.getElementById("salesChart"),

        {

            type:"line",

            data:{

                labels,

                datasets:[{

                    label:"Penjualan",

                    data:totals,

                    borderWidth:3,

                    tension:.3,

                    fill:false

                }]

            },

            options:{

                responsive:true,

                plugins:{

                    legend:{

                        display:false

                    }

                }

            }

        }

    );

}

function renderBestProducts(products){

    bestProducts.innerHTML = "";

    const medal = [

        "🥇",

        "🥈",

        "🥉"

    ];

    products.forEach((product,index)=>{

        bestProducts.innerHTML += `

        <div class="best-item">

            <div class="best-rank">

                <span>

                    ${medal[index] ?? index + 1}

                </span>

                <span>

                    ${product.name}

                </span>

            </div>

            <div class="best-count">

                ${product.sold} Terjual

            </div>

        </div>

        `;

    });

}

function renderRecentSales(sales = []) {

    if (!sales.length) {

        recentSales.innerHTML = `
            <p>Belum ada transaksi.</p>
        `;

        return;

    }

    recentSales.innerHTML = sales.map(sale => `

        <div class="recent-item">

            <div>

                <strong>#${sale.id}</strong>

                <div>${sale.customer}</div>

            </div>

            <div class="recent-total">

                ${formatRupiah(sale.total)}

            </div>

        </div>

    `).join("");

}

function formatRupiah(number) {

    return new Intl.NumberFormat(

        "id-ID",

        {

            style: "currency",

            currency: "IDR",

            minimumFractionDigits: 0

        }

    ).format(number);

}