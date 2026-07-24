import { requireAuth } from "../auth/guard.js";
import { renderLayout } from "../layout/layout.js";
import { apiFetch } from "../api/api.js";

requireAuth("admin");

renderLayout("Sales History", `

<div class="page-header">

    <h2>Sales History</h2>

</div>

<div class="card">

    <div class="table-header">

        <h3>Daftar Transaksi</h3>

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
                <th>Total</th>
                <th>Status</th>
                <th width="120">Aksi</th>

            </tr>

        </thead>

        <tbody id="saleTable">

        </tbody>

    </table>

</div>

`);

const API_URL = "/api/sales";

const saleTable = document.getElementById("saleTable");
const searchSale = document.getElementById("searchSale");

async function loadSales() {

    try {

        const response = await apiFetch(API_URL);

        if (!response) return;

        const sales = await response.json();

        saleTable.innerHTML = "";

        sales.forEach((sale, index) => {

            saleTable.innerHTML += createRow(
                sale,
                index
            );

        });

    } catch (error) {

        console.error(error);

    }

}

function createRow(sale, index) {

    return `

        <tr>

            <td>${index + 1}</td>

            <td>${sale.customer}</td>

            <td>

                ${new Date(sale.sale_date)
                    .toLocaleDateString("id-ID")}

            </td>

            <td>

                Rp ${Number(sale.total)
                    .toLocaleString("id-ID")}

            </td>

            <td>${sale.status}</td>

            <td>

                <button
                    class="btn-detail"
                    data-id="${sale.id}">

                    Detail

                </button>

            </td>

        </tr>

    `;

}

function handleTableClick(e) {

    const button = e.target;

    if (
        button.classList.contains("btn-detail")
    ) {

        const id = button.dataset.id;

        location.href =
            `sale-detail.html?id=${id}`;

    }

}

searchSale.addEventListener("input", () => {

    const keyword =
        searchSale.value.toLowerCase();

    const rows =
        saleTable.querySelectorAll("tr");

    rows.forEach(row => {

        row.style.display =
            row.innerText
                .toLowerCase()
                .includes(keyword)
                ? ""
                : "none";

    });

});

saleTable.addEventListener(
    "click",
    handleTableClick
);

loadSales();