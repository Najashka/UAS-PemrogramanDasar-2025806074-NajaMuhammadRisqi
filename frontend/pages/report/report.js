// ===============================
// IMPORT
// ===============================

import { requireAuth } from "../../js/auth/guard.js";
import { renderLayout } from "../../js/layout/layout.js";
import { apiFetch } from "../../js/api/api.js";
import { showLoading, hideLoading } from "../../js/utils/loading.js";
import { showToast } from "../../js/utils/toast.js";

// ===============================
// AUTH
// ===============================

requireAuth("admin");

// ===============================
// RENDER LAYOUT
// ===============================

renderLayout("Report", `

<div class="report-page">

    <div class="report-filter card">

        <div class="filter-group">

            <label>Dari</label>

            <input
                type="date"
                id="startDate">

        </div>

        <div class="filter-group">

            <label>Sampai</label>

            <input
                type="date"
                id="endDate">

        </div>

        <button id="filterBtn">

            <i class="fa-solid fa-filter"></i>

            Filter

        </button>

    </div>

    <div class="report-summary">

        <div class="summary-card">

            <h4>Total Penjualan</h4>

            <h2 id="totalSales">
                Rp0
            </h2>

        </div>

        <div class="summary-card">

            <h4>Total Transaksi</h4>

            <h2 id="totalTransaction">
                0
            </h2>

        </div>

        <div class="summary-card">

            <h4>Total Item</h4>

            <h2 id="totalItem">
                0
            </h2>

        </div>

    </div>

    <div class="card">

        <div class="report-action">

            <input
                id="searchReport"
                class="search-input"
                placeholder="Cari Customer">

            <button id="printReport">

                <i class="fa-solid fa-print"></i>

                Print

            </button>

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

                    <th>Item</th>


                </tr>

            </thead>

            <tbody id="reportTable">

            </tbody>

        </table>

    </div>

</div>

`);

// ===============================
// API
// ===============================

const API_URL = "/api/report";

// ===============================
// DOM
// ===============================

const startDate =
    document.getElementById("startDate");

const endDate =
    document.getElementById("endDate");

const filterBtn =
    document.getElementById("filterBtn");

const reportTable =
    document.getElementById("reportTable");

const totalSales =
    document.getElementById("totalSales");

const totalTransaction =
    document.getElementById("totalTransaction");

const totalItem =
    document.getElementById("totalItem");

const searchReport =
    document.getElementById("searchReport");

const printReport =
    document.getElementById("printReport");

// ===============================
// STATE
// ===============================

let reportData = [];

// ===============================
// CRUD FUNCTION
// ===============================

async function loadReport(){

    try{

        showLoading();

        const response =
            await apiFetch(
                `${API_URL}?start=${startDate.value}&end=${endDate.value}`
            );

        if(!response) return;

        const data =
            await response.json();

        if(!response.ok){

            throw new Error(

                data.message ||

                "Gagal memuat laporan"

            );

        }

        renderTable(data);

        renderSummary(data);

        reportData = data;

    }

    catch(error){

        console.error(error);

        showToast(error.message,"error");

    }

    finally{

        hideLoading();

    }

}

// ===============================
// UI FUNCTION
// ===============================

function createRow(sale, index) {

    return `

        <tr>

            <td>${index + 1}</td>

            <td>${escapeHtml(sale.customer)}</td>

            <td>${formatDate(sale.sale_date)}</td>

            <td>${sale.payment_method}</td>

            <td>${sale.status}</td>

            <td>${formatRupiah(sale.total)}</td>

            <td>${sale.total_item}</td>

        </tr>

    `;

}

function renderTable(data) {

    if (!data.length) {

        reportTable.innerHTML = `

            <tr>

                <td colspan="7">

                    Tidak ada data

                </td>

            </tr>

        `;

        return;

    }

    reportTable.innerHTML = data
        .map(createRow)
        .join("");

}

function renderSummary(data){

    totalTransaction.textContent =
        data.length;

    const sales =
        data.reduce(

            (sum,item)=>

                sum+Number(item.total),

            0

        );

    totalSales.textContent =
        formatRupiah(sales);

    const items = data.reduce(

        (sum, item) =>

            sum + Number(item.total_item),

        0

    );

    totalItem.textContent = items;

}

// ===============================
// HELPER
// ===============================

function printCurrentReport() {

    const storeName =
        "SALES INVENTORY SYSTEM";

    const printDate =
        new Date().toLocaleString("id-ID");

    const start =
        formatDate(startDate.value);

    const end =
        formatDate(endDate.value);

    const totalSalesValue =
        totalSales.textContent;

    const totalTransactionValue =
        totalTransaction.textContent;

    const totalItemValue =
        totalItem.textContent;

    let rows = "";

    reportData.forEach((sale, index) => {

        rows += `

        <tr>

        <td>${index + 1}</td>

        <td>${escapeHtml(sale.customer)}</td>

        <td>${formatDate(sale.sale_date)}</td>

        <td>${sale.payment_method}</td>

        <td>${sale.status}</td>

        <td>${sale.total_item}</td>

        <td>${formatRupiah(sale.total)}</td>

        </tr>

        `;

    });

    const win = window.open("", "_blank");

    win.document.write(`

<!DOCTYPE html>

<html>

<head>

<meta charset="UTF-8">

<title>Laporan Penjualan</title>

<style>

body{

    font-family:Arial;

    padding:30px;

}

h2{

    text-align:center;

}

table{

    width:100%;

    border-collapse:collapse;

    margin-top:20px;

}

th,td{

    border:1px solid #ccc;

    padding:8px;

}

th{

    background:#f5f5f5;

}

.summary{

    margin-top:30px;

}

.summary p{

    margin:6px 0;

    font-weight:bold;

}

</style>

</head>

<body>

<div class="header">

    <h1>${storeName}</h1>

    <h2>LAPORAN PENJUALAN</h2>

</div>

<div class="info">

    <p>

        <strong>Periode :</strong>

        ${start} - ${end}

    </p>

    <p>

        <strong>Tanggal Cetak :</strong>

        ${printDate}

    </p>

</div>

<table>

<thead>

<tr>

<th>No</th>

<th>Customer</th>

<th>Tanggal</th>

<th>Pembayaran</th>

<th>Status</th>

<th>Item</th>

<th>Total</th>

</tr>

</thead>

<tbody>

${rows}

</tbody>

</table>

<div class="summary">

<table>

<tr>

<td><strong>Total Penjualan</strong></td>

<td><strong>${totalSalesValue}</strong></td>

</tr>

<tr>

<td>Total Transaksi</td>

<td>${totalTransactionValue}</td>

</tr>

<tr>

<td>Total Item</td>

<td>${totalItemValue}</td>

</tr>

</table>

</div>

<div class="footer">

<hr>

<p>

Dicetak :

${printDate}

</p>

<p>

Sales Inventory System

</p>

</div>

</body>

</html>

`);

    win.document.close();

    setTimeout(() => {

        win.print();

        win.close();

    }, 300);

}

function formatDate(date){

    return new Date(date)

    .toLocaleDateString(

        "id-ID",

        {

            day:"2-digit",

            month:"short",

            year:"numeric"

        }

    );

}

function formatRupiah(number){

    return new Intl.NumberFormat(

        "id-ID",

        {

            style:"currency",

            currency:"IDR",

            minimumFractionDigits:0

        }

    ).format(number);

}

function setDefaultDate() {

    const today = new Date();

    startDate.value = new Date(

        today.getFullYear(),
        today.getMonth(),
        1

    ).toISOString().split("T")[0];

    endDate.value =
        today.toISOString().split("T")[0];

}

function searchReportTable() {

    const keyword =
        searchReport.value
            .trim()
            .toLowerCase();

    const filtered = reportData.filter(item =>

        item.customer
            .toLowerCase()
            .includes(keyword)

    );

    renderTable(filtered);

}

function escapeHtml(str) {

    if (str == null) return "-";

    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");

}

// ===============================
// INITIALIZE
// ===============================

function init() {

    setDefaultDate();

    filterBtn.addEventListener(
        "click",
        loadReport
    );

    searchReport.addEventListener(
        "input",
        searchReportTable
    );

    printReport.addEventListener(
        "click",
        printCurrentReport
    );

    loadReport();

}

init()