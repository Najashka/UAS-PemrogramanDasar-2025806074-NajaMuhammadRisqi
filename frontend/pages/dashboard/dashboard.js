// ===============================
// IMPORT
// ===============================

import { requireAuth } from "../../js/auth/guard.js";
import { renderLayout } from "../../js/layout/layout.js";
import { apiFetch } from "../../js/api/api.js";
import { hideLoading, showLoading } from "../../js/utils/loading.js";
import { showToast } from "../../js/utils/toast.js";

// ===============================
// AUTH
// ===============================

requireAuth("admin");

// ===============================
// RENDER LAYOUT
// ===============================

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

// ===============================
// API
// ===============================

const API_URL = "/api/dashboard";

// ===============================
// STATE
// ===============================

let salesChart = null;

// ===============================
// DOM
// ===============================

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

// ===============================
// CRUD FUNCTIONS
// ===============================

// ===============================
// LOAD DASHBOARD
// ===============================

async function loadDashboard() {

    showLoading();

    try {

        const response =
            await apiFetch(API_URL);

        if (!response) return;

        const data =
            await response.json();

        if (!response.ok) {

            throw new Error(

                data.message ||
                "Gagal memuat dashboard"

            );

        }

        updateSummary(data);

        renderChart(data.weeklySales);

        renderBestProducts(data.bestProducts);

        renderRecentSales(data.recentSales);

    }

    catch (error) {

        console.error(error);

        showToast(

            error.message,

            "error"

        );

    }

    finally {

        hideLoading();

    }

}

// ===============================
// UI FUNCTIONS
// ===============================

function updateSummary(data) {

    todaySales.textContent =
        formatRupiah(data.todaySales);

    todayTransactions.textContent =
        data.todayTransactions;

    totalProducts.textContent =
        data.totalProducts;

    totalCustomers.textContent =
        data.totalCustomers;

}

function renderChart(weeklySales = []) {

    if (salesChart) {

        salesChart.destroy();

    }

    const labels = weeklySales.map(item =>

        new Date(item.date).toLocaleDateString(

            "id-ID",

            {

                day: "2-digit",

                month: "short"

            }

        )

    );

    const totals = weeklySales.map(item =>

        Number(item.total)

    );

    salesChart = new Chart(

        document.getElementById("salesChart"),

        {

            type: "line",

            data: {

                labels,

                datasets: [

                    {

                        label: "Penjualan",

                        data: totals,

                        borderWidth: 3,

                        tension: .3,

                        fill: false

                    }

                ]

            },

            options: {

                responsive: true,

                plugins: {

                    legend: {

                        display: false

                    }

                }

            }

        }

    );

}

function renderBestProducts(products = []) {

    bestProducts.innerHTML = products

        .map(createBestProductRow)

        .join("");

}

function renderRecentSales(sales = []) {

    if (!sales.length) {

        recentSales.innerHTML = `

            <p>Belum ada transaksi.</p>

        `;

        return;

    }

    recentSales.innerHTML = sales

        .map(createRecentSaleRow)

        .join("");

}

// ===============================
// HELPER FUNCTIONS
// ===============================

function createBestProductRow(product, index) {

    const medal = [

        "🥇",

        "🥈",

        "🥉"

    ];

    return `

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

}

function createRecentSaleRow(sale) {

    return `

        <div class="recent-item">

            <div>

                <strong>

                    #${sale.id}

                </strong>

                <div>

                    ${sale.customer}

                </div>

            </div>

            <div class="recent-total">

                ${formatRupiah(sale.total)}

            </div>

        </div>

    `;

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

// ===============================
// INITIALIZE
// ===============================

function init() {

    loadDashboard();

}

init();