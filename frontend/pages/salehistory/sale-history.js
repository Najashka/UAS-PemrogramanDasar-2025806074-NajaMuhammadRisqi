// ===============================
// IMPORT
// ===============================

import { requireAuth } from "../../js/auth/guard.js";
import { renderLayout } from "../../js/layout/layout.js";
import { apiFetch } from "../../js/api/api.js";
import {
    showLoading,
    hideLoading
} from "../../js/utils/loading.js";

import {
    showToast
} from "../../js/utils/toast.js";

// ===============================
// AUTH
// ===============================

requireAuth("admin");

// ===============================
// RENDER LAYOUT
// ===============================

renderLayout("Sales History", `


<div class="page-header">

    <h2>Sales History</h2>

</div>


<div class="card">


    <div class="table-header">


        <h3>Riwayat Penjualan</h3>


        <input
            id="searchSale"
            placeholder="Cari Customer">


    </div>



    <table class="table">


        <thead>

            <tr>

                <th>No</th>

                <th>Customer</th>

                <th>Tanggal</th>

                <th>Pembayaran</th>

                <th>Status</th>

                <th>Total</th>

                <th>Aksi</th>

            </tr>


        </thead>


        <tbody id="saleHistoryTable">


        </tbody>


    </table>


</div>

<!-- Detail Modal -->

<div id="saleModal" class="modal">

    <div class="modal-content modal-wide">


        <div class="modal-header">

            <h3>Detail Penjualan</h3>

            <button id="closeModal" class="modal-close">

                <i class="fa-solid fa-xmark"></i>

            </button>

        </div>


        <div id="saleDetail">


        </div>


    </div>

</div>

`);

// ===============================
// API
// ===============================

const SALES_API = "/api/sales";

// ===============================
// DOM
// ===============================

const saleHistoryTable =
    document.getElementById("saleHistoryTable");
const saleModal =
    document.getElementById("saleModal");
const saleDetail =
    document.getElementById("saleDetail");
const closeModal =
    document.getElementById("closeModal");
const searchSale =
    document.getElementById("searchSale");

// ===============================
// STATE
// ===============================

let salesData = [];

// ===============================
// CRUD FUNCTION
// ===============================

async function loadSalesHistory() {

    showLoading();

    try {

        const response =
            await apiFetch(SALES_API);

        if (!response) return;

        const sales =
            await response.json();

        if (!response.ok) {

            throw new Error(

                sales.message ||

                "Gagal memuat data"

            );

        }

        salesData = sales;

        renderSalesTable(salesData);

    } catch (error) {

        console.error(error);

        showToast(
            error.message,
            "error"
        );

    } finally {

        hideLoading();

    }

}

async function detailSale(id) {

    showLoading();

    try {

        const response =
            await apiFetch(`${SALES_API}/${id}`);

        if (!response) return;

        const data =
            await response.json();

        if (!response.ok) {

            throw new Error(

                data.message ||

                "Gagal memuat detail penjualan"

            );

        }

        renderSaleDetail(data);

        showModal();

    } catch (error) {

        console.error(error);

        showToast(

            error.message,

            "error"

        );

    } finally {

        hideLoading();

    }

}

// ===============================
// UI FUNCTION
// ===============================

function renderSalesTable(data) {

    if (!data.length) {

        saleHistoryTable.innerHTML = `

            <tr>

                <td colspan="7" class="text-center">

                    Data tidak ditemukan

                </td>

            </tr>

        `;

        return;

    }

    saleHistoryTable.innerHTML = data
        .map(createRow)
        .join("");

}

function renderSaleDetail(data) {

    const {
        sale,
        details
    } = data;

    saleDetail.innerHTML = `

        <div class="detail-info">

            <div>

                <strong>Customer</strong>

                <p>${sale.customer}</p>

            </div>

            <div>

                <strong>Tanggal</strong>

                <p>${formatDate(sale.sale_date)}</p>

            </div>

            <div>

                <strong>Pembayaran</strong>

                <p>${sale.payment_method}</p>

            </div>

            <div>

                <strong>Status</strong>

                <span class="status ${sale.status.toLowerCase()}">

                    ${formatStatus(sale.status)}

                </span>

            </div>

        </div>

        <table class="table">

            <thead>

                <tr>

                    <th>Produk</th>
                    <th>Qty</th>
                    <th>Harga</th>
                    <th>Subtotal</th>

                </tr>

            </thead>

            <tbody>

                ${details.map(createDetailRow).join("")}

            </tbody>

        </table>

        <div class="total-box">

            <span>Total Pembayaran</span>

            <span>

                ${formatCurrency(sale.total)}

            </span>

        </div>

    `;

}

function showModal() {

    saleModal.classList.add("show");

}

function hideModal() {

    saleModal.classList.remove("show");

}

// ===============================
// EVENT HANDLER
// ===============================

function handleModalClick(event) {

    if (event.target === saleModal) {

        hideModal();

    }

}

function handleEscape(event) {

    if (

        event.key === "Escape" &&

        saleModal.classList.contains("show")

    ) {

        hideModal();

    }

}

function searchSalesTable() {

    const keyword =
        searchSale.value
            .trim()
            .toLowerCase();

    const filtered = salesData.filter(

        sale =>

            sale.customer
                .toLowerCase()
                .includes(keyword)

    );

    renderSalesTable(filtered);

}

function handleTableClick(event) {

    const button =
        event.target.closest("button");

    if (!button) return;

    const id =
        button.dataset.id;

    if (button.classList.contains("btn-detail")) {

        detailSale(id);

    }

    if (button.classList.contains("btn-print")) {

        printSale(id);

    }

}

// ===============================
// HELPER
// ===============================

function createRow(sale, index) {

    return `

        <tr>

            <td>${index + 1}</td>

            <td>${sale.customer}</td>

            <td>${formatDate(sale.sale_date)}</td>

            <td>${sale.payment_method}</td>

            <td>

                <span class="status ${sale.status.toLowerCase()}">

                    ${formatStatus(sale.status)}

                </span>

            </td>

            <td class="total-column">

                ${formatCurrency(sale.total)}

            </td>

            <td class="action-column">

                <button
                    type="button"
                    class="btn-detail"
                    data-id="${sale.id}">

                    <i class="fa-solid fa-eye"></i>

                    Detail

                </button>

                <button
                    class="btn-print"
                    data-id="${sale.id}">

                    <i class="fa-solid fa-print"></i>

                    Print

                </button>

            </td>

        </tr>

    `;

}

function createDetailRow(item) {

    return `
        <tr>

            <td>${item.product}</td>

            <td>${item.quantity}</td>

            <td>${formatCurrency(item.price)}</td>

            <td>${formatCurrency(item.subtotal)}</td>

        </tr>
    `;

}

function printSale(id) {

    window.open(
        `/pages/receipt/receipt.html?id=${id}`,
        "_blank"
    );

}

function formatDate(date) {

    return new Date(date).toLocaleDateString("id-ID", {

        day: "2-digit",
        month: "short",
        year: "numeric"

    });

}

function formatCurrency(value) {

    return `Rp ${Number(value).toLocaleString("id-ID")}`;

}

function formatStatus(status) {

    return status.charAt(0).toUpperCase() +
        status.slice(1).toLowerCase();

}

// ===============================
// INIT
// ===============================

function init() {

    searchSale.addEventListener(
        "input",
        searchSalesTable
    );

    closeModal.addEventListener(
        "click",
        hideModal
    );

    saleModal.addEventListener(
        "click",
        handleModalClick
    );

    document.addEventListener(
        "keydown",
        handleEscape
    );

    saleHistoryTable.addEventListener(
        "click",
        handleTableClick
    );

    loadSalesHistory();

}

init();