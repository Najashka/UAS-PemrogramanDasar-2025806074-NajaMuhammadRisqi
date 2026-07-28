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

    <div class="modal-content">


        <div class="modal-header">

            <h3>Detail Penjualan</h3>

            <button id="closeModal">

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
// Helper
// ===============================

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

let salesData = [];

// ===============================
// Load Sales History
// ===============================

async function loadSalesHistory() {

    try {

        const response = await apiFetch(SALES_API);

        if (!response) return;

        const sales = await response.json();

        if (!response.ok) {

            alert(sales.message);

            return;

        }

        salesData = sales;

        renderSalesTable(salesData);

    } catch (error) {

        console.error(error);

    }

}

function renderSalesTable(data) {

    saleHistoryTable.innerHTML = "";

    if (data.length === 0) {

        saleHistoryTable.innerHTML = `

            <tr>

                <td colspan="7" style="text-align:center">

                    Data tidak ditemukan

                </td>

            </tr>

        `;

        return;

    }

    data.forEach((sale, index) => {

        saleHistoryTable.innerHTML += `

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
                    class="btn-detail"
                    onclick="detailSale(${sale.id})">

                    <i class="fa-solid fa-eye"></i>

                    Detail

                </button>

                <button
                    class="btn-print"
                    onclick="printSale(${sale.id})">

                    <i class="fa-solid fa-print"></i>

                    Print

                </button>

            </td>

        </tr>

        `;

    });

}

// ===============================
// Detail Sale
// ===============================

async function detailSale(id) {


    try {


        const response =
            await apiFetch(`${SALES_API}/${id}`);



        if(!response) return;



        const data =
            await response.json();



        if(!response.ok){

            alert(data.message);

            return;

        }



        const sale = data.sale;

        const details = data.details;



        saleDetail.innerHTML = `

        <div class="detail-info">

            <div>

                <strong>Customer</strong>

                <p>${sale.customer}</p>

            </div>

            <div>

                <p>${formatDate(sale.sale_date)}</p>

                <p>
                    ${new Date(sale.sale_date).toLocaleDateString("id-ID")}
                </p>

            </div>

            <div>

                <strong>Pembayaran</strong>

                <p>${sale.payment_method}</p>

            </div>

            <div>

                <strong>Status</strong>

                <p>

                    <span class="status ${sale.status.toLowerCase()}">
                        ${formatStatus(sale.status)}
                    </span>

                </p>

            </div>

        </div>

        <table class="table">

            <thead>

                <tr>

                    <th>Product</th>

                    <th>Qty</th>

                    <th>Harga</th>

                    <th>Subtotal</th>

                </tr>

            </thead>

            <tbody>

                ${details.map(item => `

                    <tr>

                        <td>${item.product}</td>

                        <td>${item.quantity}</td>

                        <td>
                            ${formatCurrency(item.price)}
                        </td>

                        <td>
                            ${formatCurrency(item.subtotal)}
                        </td>

                    </tr>

                `).join("")}

            </tbody>

        </table>

        <div class="total-box">

            <span>Total Pembayaran</span>

            <span>

                ${formatCurrency(sale.total)}

            </span>

        </div>

        `;



        saleModal.style.display = "flex";


    }catch(error){

        console.error(error);

    }

}

// ===============================
// PRINT SALE
// ===============================

function printSale(id) {

    window.open(
        `/pages/receipt.html?id=${id}`,
        "_blank"
    );

}

loadSalesHistory();
closeModal.addEventListener("click",()=>{

    saleModal.style.display = "none";

});
searchSale.addEventListener("keyup", () => {

    const keyword = searchSale.value
        .toLowerCase()
        .trim();

    const filtered = salesData.filter(sale =>

        sale.customer
            .toLowerCase()
            .includes(keyword)

    );

    renderSalesTable(filtered);

});
saleModal.addEventListener("click", (e) => {

    if (e.target === saleModal) {

        saleModal.style.display = "none";

    }

});
document.addEventListener("keydown", (e) => {

    if (

        e.key === "Escape" &&

        saleModal.style.display === "flex"

    ) {

        saleModal.style.display = "none";

    }

});
window.detailSale = detailSale;
window.printSale = printSale;